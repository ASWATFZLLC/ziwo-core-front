import {AgentInfo} from '../authentication.service';
import {UserMedia} from './userMedia';
import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {VideoInfo} from './media-channel';
import {JsonRpcClient} from './json-rpc';
import {JsonRpcEvent, JsonRpcEventType,} from './json-rpc.interfaces';
import {RtcClientHandlers} from './rtc-client.handlers';
import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {JsonRpcParams} from './json-rpc.params';

export interface MediaConstraint {
  audio:boolean;
  video:boolean;
}

/**
 * RtcClient wraps all interaction with WebRTC
 *
 * Inheritance:
 *  - RtcClientBase: shared properties, getter, setters & errors
 *  - RtcRequests: send new request (start call, answer call, ...)
 *  - RtcHandlers: handler incoming message (call received, outgoing call, ...)
 */
export class RtcClient extends RtcClientHandlers {

  constructor(tags:VideoInfo, debug?:boolean) {
    super(tags, debug);
  }

  /**
   * Connect an agent using its Info
   */
  public connectAgent(agent:AgentInfo):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.connectedAgent = agent;
      this.jsonRpcClient = new JsonRpcClient(this.debug);
      // First we make ensure access to microphone &| camera
      // And wait for the socket to open
      Promise.all([
        UserMedia.getUserMedia({audio: true, video: false}),
        this.jsonRpcClient.openSocket(this.connectedAgent.webRtc.socket),
      ]).then(res => {
        this.channel = res[0];
        this.jsonRpcClient?.addListener((ev:JsonRpcEvent) => {
          if (ev.type === JsonRpcEventType.LoggedIn) {
            ZiwoEvent.emit(ZiwoEventType.AgentConnected);
            onRes();
            return;
          }
          // This is our global handler for incoming message
          this.processIncomingSocketMessage(ev);
        });
        this.jsonRpcClient?.login(agent.position);
      }).catch(err => {
        onErr(err);
      });
    });
  }

  public startCall(phoneNumber:string):void {
    if (!this.isAgentConnected() || !this.channel || !this.jsonRpcClient) {
      this.sendNotConnectedEvent('start call');
      return;
    }
    if (!PATTERNS.phoneNumber.test(phoneNumber)) {
      return ZiwoEvent.emit(ZiwoEventType.Error, {
        code: ErrorCode.InvalidPhoneNumber,
        message: MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
        data: {
          phoneNumber: phoneNumber,
        }
      });
    }
    this.channel?.startMicrophone();
    this.calls.push(this.jsonRpcClient.startCall(phoneNumber, JsonRpcParams.getUuid(), this.channel, this.tags));
  }


  private processIncomingSocketMessage(ev:JsonRpcEvent):void {
    if (this.debug) {
      console.log('New incoming message', ev);
    }
    switch (ev.type) {
      case JsonRpcEventType.OutgoingCall:
        this.outgoingCall(ev.payload);
        break;
      case JsonRpcEventType.MediaRequest:
        this.acceptMediaRequest(ev.payload);
        break;
    }
  }

}
