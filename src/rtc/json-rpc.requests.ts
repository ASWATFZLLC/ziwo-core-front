import {JsonRpcBase} from './json-rpc.base';
import {AgentPosition} from '../authentication.service';
import {JsonRpcParams} from './json-rpc.params';
import {Channel} from './channel';
import {Call} from './call';

export class JsonRpcRequests extends JsonRpcBase {

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
      this.send(JsonRpcParams.loginParams(this.sessid, agentPosition.name, agentPosition.password));
    });
  }

  /**
   * send a start call request
   */
  public startCall(phoneNumber:string, callId:string, channel:Channel):Call {
    if (!channel.stream) {
      throw new Error('Error in User Media');
    }

    // Create Call and its PeerConnection
    const call = new Call(callId, new RTCPeerConnection({
      iceServers: [{urls: this.ICE_SERVER}],
    }));

    call.rtcPeerConnection.ontrack = (tr) => {
      console.log('tr', tr);
    };

    call.rtcPeerConnection.onconnectionstatechange = (st) => {
      console.log(st);
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

}
