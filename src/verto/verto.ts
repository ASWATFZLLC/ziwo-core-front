import {AgentPosition, AgentInfo} from '../authentication.service';
import {MediaChannel, MediaInfo} from '../media-channel';
import {Call} from '../call';
import {VertoParams, VertoByeReason, VertoState} from './verto.params';
import {VertoOrchestrator} from './verto.orchestrator';
import {ZiwoEvent, ZiwoErrorCode, ZiwoEventType} from '../events';
import {MESSAGES} from '../messages';
import {RTCPeerConnectionFactory} from './RTCPeerConnection.factory';
import {VertoClear} from './verto.clear';
import { VertoSession } from './verto.session';

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
   * Media video tags
   */
  public tags:MediaInfo;

  /**
   *
   */
  public params:VertoParams;

  /**
   * Session ID used with the current socket
   */
  public sessid?:string;

  /**
   * User Media Channel
   */
  public channel?:MediaChannel;

  /**
   * Our communication channel
   */
  private socket?:WebSocket;

  /**
   * Information about agent
   */
  private position?:AgentPosition;

  /**
   * Callback functions - register using `addListener`
   */
  private listeners:Function[] = [];

  // Components
  private orchestrator:VertoOrchestrator;
  private cleaner:VertoClear;

  private readonly debug:boolean;

  private readonly STUN_ICE_SERVER = 'stun:stun.l.google.com:19302';

  /**
   * Reference to list of running calls
   */
  public readonly calls:Call[];

  constructor(calls:Call[], debug:boolean, tags:MediaInfo) {
    this.debug = debug;
    this.tags = tags;
    this.orchestrator = new VertoOrchestrator(this, this.debug);
    this.cleaner = new VertoClear(this, this.debug);
    this.params = new VertoParams();
    this.calls = calls;
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
  public startCall(phoneNumber:string):Call|undefined {
    if (!this.channel || !this.channel.stream) {
      // TODO : throw Ziwo Error Event
      throw new Error('Error in User Media');
    }
    try {
      const callId = this.params.getUuid();
      const pc = RTCPeerConnectionFactory.outbound(this, callId, this.getLogin(), phoneNumber);
      const call = new Call(callId, this, phoneNumber, this.getLogin(), pc, 'outbound');
      call.pushState(ZiwoEventType.Requesting, true);
      call.pushState(ZiwoEventType.Trying, true);
      return call;
    } catch (e) {
      ZiwoEvent.error(ZiwoErrorCode.CannotCreateCall, e);
      return undefined;
    }
  }

  /**
   * Answer a call
   */
  public answerCall(callId:string, phoneNumber:string, sdp:string):void {
    try {
      this.send(this.params.answerCall(this.sessid as string, callId, this.getLogin(), phoneNumber, sdp));
      const c = this.calls.find(x => x.callId === callId);
      if (c) {
        c.pushState(ZiwoEventType.Active);
      }
    } catch (e) {
      ZiwoEvent.error(ZiwoErrorCode.MissingCall, e);
    }
  }

  /**
   * Hang up a specific call
   */
  public hangupCall(callId:string, phoneNumber:string, reason:VertoByeReason = VertoByeReason.NORMAL_CLEARING):void {
    this.send(this.params.hangupCall(this.sessid as string, callId, this.getLogin(), phoneNumber, reason));
    this.purgeAndDestroyCall(callId);
  }

  /**
   * Hold a specific call
   */
  public holdCall(callId:string, phoneNumber:string):void {
    this.send(this.params.setState(this.sessid as string, callId, this.getLogin(), phoneNumber, VertoState.Hold));
  }

  /**
   * Hang up a specific call
   */
  public unholdCall(callId:string, phoneNumber:string):void {
    this.send(this.params.setState(this.sessid as string, callId, this.getLogin(), phoneNumber, VertoState.Unhold));
  }

  public blindTransfer(transferTo:string, callId:string, phoneNumber:string):void {
    this.send(this.params.transfer(this.sessid as string, callId, this.getLogin(), phoneNumber, transferTo));
  }

  /**
   * Purge a specific call
   */
  public purgeCall(callId:string):void {
    const call = this.calls.find(x => x.callId === callId);
    if (call) {
      call.pushState(ZiwoEventType.Purge);
    }
  }

  /**
   * Destroy a specific call.
   */
  public destroyCall(callId:string):void {
    const callIndex = this.calls.findIndex(x => x.callId === callId);
    if (callIndex === -1) {
      return;
    }
    this.calls[callIndex].pushState(ZiwoEventType.Destroy);
    this.cleaner.destroyCall(this.calls[callIndex]);
    this.calls.splice(callIndex, 1);
  }

  /**
   * Purge & Destroy a specific call.
   */
  public purgeAndDestroyCall(callId:string):void {
    this.purgeCall(callId);
    this.destroyCall(callId);
  }

  /**
   * DTFM send a char to current call
   */
  public dtfm(callId:string, char:string):void {
    this.send(this.params.dtfm(this.sessid as string, callId, this.getLogin(), char));
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
      this.sessid = VertoSession.get();
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
        if (this.debug) {
          console.log('Socket opened');
        }
        // clear.prepareUnloadEvent makes sure we clear the calls properly when user closes the tab
        this.cleaner.prepareUnloadEvent();
        onRes();
      };
      this.socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (!this.isJsonRpcValid) {
            ZiwoEvent.error(ZiwoErrorCode.ProtocolError, data);
            throw new Error('Message is not a valid format');
          }
          const callId = data.params && data.params.callID ? data.params.callID :
            (data.result && data.result.callID ? data.result.callID : undefined);
          const relatedCall = callId ? this.calls.find(c => c.callId === callId) : undefined;
          this.orchestrator.onInput(data, relatedCall);
        } catch (err) {
          ZiwoEvent.error(ZiwoErrorCode.ProtocolError, err);
          if (this.debug) {
            console.warn('Invalid incoming message', err);
          }
        }
      };
    });
  }

  public getNewRTCPeerConnection():RTCPeerConnection {
    const rtcPeerConnection = new RTCPeerConnection({
      iceServers: [{urls: this.STUN_ICE_SERVER}],
    });

    return rtcPeerConnection;
  }

  /**
   * Concat position to return the login used in Json RTC request
   */
  public getLogin():string {
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
