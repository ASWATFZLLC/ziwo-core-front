import {AgentPosition} from '../authentication.service';
import {JsonRpcParams} from './json-rpc.params';
import {MediaChannel, MediaInfo} from './media-channel';
import {Call} from './call';
import {JsonRpcBase} from './json-rpc.base';

export enum ZiwoSocketEvent {
  LoggedIn = 'LoggedIn',
  CallCreated = 'CallCreated',
}

/**
 * JsonRpcClient implements Verto protocol using JSON RPC
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
 *      .then(() => {
 *        this.login() // REQUIRED: log the agent into the web socket
 *        // You can now proceed with any requests
 *      });
 *
 */
export class JsonRpcClient extends JsonRpcBase {

  private readonly ICE_SERVER = 'stun:stun.l.google.com:19302';

  constructor(debug?:boolean) {
    super(debug);
  }


  /**
   * Following functions send a request to the opened socket. They do not return the result of the request
   * Instead, you should use `addListener` and use the Socket events to follow the status of the request.
   */

  /**
   * login log the agent in the newly created socket
   */
  public login(agentPosition:AgentPosition):Promise<void> {
    this.position = agentPosition;
    return new Promise<void>((onRes, onErr) => {
      if (!this.socket) {
        return onErr();
      }
      this.sessid = JsonRpcParams.getUuid();
      this.send(JsonRpcParams.login(this.sessid, agentPosition.name, agentPosition.password));
    });
  }

  /**
   * send a start call request
   */
  public startCall(phoneNumber:string, callId:string, channel:MediaChannel, tags:MediaInfo):Call {
    if (!channel.stream) {
      throw new Error('Error in User Media');
    }

    // Create Call and its PeerConnection
    const call = new Call(
      callId,
      this,
      new RTCPeerConnection({
        iceServers: [{urls: this.ICE_SERVER}],
      }),
      channel,
      phoneNumber
    );

    call.rtcPeerConnection.ontrack = (tr) => {
      const track = tr.track;
      if (track.kind !== 'audio') {
        return;
      }
      const stream = new MediaStream();
      stream.addTrack(track);
      channel.remoteStream = stream;
      tags.peerTag.srcObject = stream;
    };

    // Attach our media stream to the call's PeerConnection
    channel.stream.getTracks().forEach((track:any) => {
      call.rtcPeerConnection.addTrack(track);
    });

    // We wait for candidate to be null to make sure all candidates have been processed
    call.rtcPeerConnection.onicecandidate = (candidate) => {
      if (!candidate.candidate) {
        this.send(JsonRpcParams.startCall(
          this.sessid,
          call.callId,
          this.getLogin(),
          phoneNumber,
          call.rtcPeerConnection.localDescription?.sdp as string)
        );
      }
    };

    call.rtcPeerConnection.createOffer().then(offer => {
      call.rtcPeerConnection.setLocalDescription(offer).then(() => {});
    });

    return call;
  }

  /**
   * Hang up a specific call
   */
  public hangupCall(callId:string, phoneNumber:string):void {
    this.send(JsonRpcParams.hangupCall(this.sessid as string, callId, this.getLogin(), phoneNumber));
  }

}
