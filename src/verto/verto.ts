import {AgentPosition, AgentInfo} from '../authentication.service';
import {MediaChannel, MediaInfo} from '../media-channel';
import {Call} from '../call';
import {VertoParams} from './verto.params';
import {VertoOrchestrator} from './verto.orchestrator';
import { ZiwoEvent, ZiwoErrorCode } from '../events';
import { MESSAGES } from '../messages';

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
export class Verto {

  /**
   * Our communication channel
   */
  private socket?:WebSocket;

  /**
   * Session ID used with the current socket
   */
  private sessid?:string;

  /**
   * Information about agent
   */
  private position?:AgentPosition;

  /**
   * Callback functions - register using `addListener`
   */
  private listeners:Function[] = [];

  /**
   * User Media Channel
   */
  private channel?:MediaChannel;

  /**
   * Media video tags
   */
  private tags:MediaInfo;

  /**
   *
   */
  private orchestrator:VertoOrchestrator;

  /**
   *
   */
  private params:VertoParams;

  private readonly debug:boolean;

  private readonly ICE_SERVER = 'stun:stun.l.google.com:19302';

  constructor(debug:boolean, tags:MediaInfo) {
    this.debug = debug;
    this.tags = tags;
    this.orchestrator = new VertoOrchestrator(this.debug);
    this.params = new VertoParams();
  }


  /**
   * addListener allows to listen for incoming Socket Event
   */
  public addListener(call:Function):void {
    this.listeners.push(call);
  }

  public connectAgent(agent:AgentInfo):Promise<AgentInfo> {
    return new Promise<AgentInfo>((onRes, onErr) => {
      // First we make ensure access to microphone &| camera
      // And wait for the socket to open
      Promise.all([
        MediaChannel.getUserMediaAsChannel({audio: true, video: false}),
        this.openSocket(agent.webRtc.socket),
      ]).then(res => {
        this.channel = res[0];
        this.login(agent.position);
      }).catch(err => {
        onErr(err);
      });
    });
  }

  /**
   * send a start call request
   */
  public startCall(phoneNumber:string):Call {
    if (!this.channel || !this.channel.stream) {
      // TODO : throw Ziwo Error Event
      throw new Error('Error in User Media');
    }

    // Create Call and its PeerConnection
    const call = new Call(
      this.params.getUuid(),
      this,
      new RTCPeerConnection({
        iceServers: [{urls: this.ICE_SERVER}],
      }),
      this.channel,
      phoneNumber
    );

    call.rtcPeerConnection.ontrack = (tr:any) => {
      const track = tr.track;
      if (track.kind !== 'audio') {
        return;
      }
      const stream = new MediaStream();
      stream.addTrack(track);
      this.ensureMediaChannelIsValid();
      (this.channel as MediaChannel).remoteStream = stream;
      this.tags.peerTag.srcObject = stream;
    };

    // Attach our media stream to the call's PeerConnection
    this.channel.stream.getTracks().forEach((track:any) => {
      call.rtcPeerConnection.addTrack(track);
    });

    // We wait for candidate to be null to make sure all candidates have been processed
    call.rtcPeerConnection.onicecandidate = (candidate:any) => {
      if (!candidate.candidate) {
        this.send(this.params.startCall(
          this.sessid,
          call.callId,
          this.getLogin(),
          phoneNumber,
          call.rtcPeerConnection.localDescription?.sdp as string)
        );
      }
    };

    call.rtcPeerConnection.createOffer().then((offer:any) => {
      call.rtcPeerConnection.setLocalDescription(offer).then(() => {});
    });

    return call;
  }

  /**
   * Hang up a specific call
   */
  public hangupCall(callId:string, phoneNumber:string):void {
    this.send(this.params.hangupCall(this.sessid as string, callId, this.getLogin(), phoneNumber));
  }

  /**
   * Hold a specific call
   */
  public holdCall(callId:string, phoneNumber:string):void {
    this.send(this.params.holdCall(this.sessid as string, callId, this.getLogin(), phoneNumber));
  }

  /**
   * Hang up a specific call
   */
  public unholdCall(callId:string, phoneNumber:string):void {
    this.send(this.params.unholdCall(this.sessid as string, callId, this.getLogin(), phoneNumber));
  }

  /**
   * Send data to socket and log in case of debug
   */
  public send(data:any):void {
    if (this.debug) {
      console.log('Write message > ', data);
    }
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  /**
   * login log the agent in the newly created socket
   */
  private login(agentPosition:AgentPosition):Promise<void> {
    this.position = agentPosition;
    return new Promise<void>((onRes, onErr) => {
      if (!this.socket) {
        return onErr();
      }
      this.sessid = this.params.getUuid();
      this.send(this.params.login(this.sessid, agentPosition.name, agentPosition.password));
    });
  }

  /**
   * openSocket should be called directly after the constructor
   * It initializate the socket and set the handlers
   */
  private openSocket(socketUrl:string):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.socket = new WebSocket(socketUrl);
      this.socket.onclose = () => {
        if (this.debug) {
          console.log('Socket closed');
        }
      };
      this.socket.onopen = () => {
        onRes();
      };
      this.socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (!this.isJsonRpcValid) {
            ZiwoEvent.error(ZiwoErrorCode.ProtocolError, data);
            throw new Error('Message is not a valid format');
          }
          const ev = this.orchestrator.handleMessage(data);
          if (ev) {
            ev.emit();
          }
        } catch (err) {
          ZiwoEvent.error(ZiwoErrorCode.ProtocolError, err);
          if (this.debug) {
            console.warn('Invalid message. See logs for futher information');
          }
        }
      };
    });
  }

  /**
   * Concat position to return the login used in Json RTC request
   */
  protected getLogin():string {
    return `${this.position?.name}@${this.position?.hostname}`;
  }

  protected ensureMediaChannelIsValid():boolean {
    if (!this.channel || !this.channel.stream) {
      ZiwoEvent.error(ZiwoErrorCode.MediaError, MESSAGES.MEDIA_ERROR);
      return false;
    }
    return true;
  }

  /**
   * Validate the JSON RPC headersx
   */
  private isJsonRpcValid(data:any):boolean {
    return typeof data === 'object'
      && 'jsonrpc' in data
      && data.jsonrpc === '2.0';
  }

}
