import {AgentInfo} from '../authentication.service';
import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {MediaInfo, MediaChannel} from './media-channel';
import {JsonRpcClient} from './json-rpc';
import {JsonRpcEvent, JsonRpcEventType,} from './json-rpc.interfaces';
import {RtcClientHandlers} from './rtc-client.handlers';
import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {JsonRpcParams} from './json-rpc.params';
import {Call} from './call';

export interface MediaConstraint {
  audio:boolean;
  video:boolean;
}

/**
 * RtcClient wraps all interaction with WebRTC
 * It holds the validation & all properties required for usage of Web RTC
 */
export class RtcClient extends RtcClientHandlers {

  constructor(tags:MediaInfo, debug?:boolean) {
    super(tags, debug);
  }

  /**
   * User Agent Info to authenticate on the socket
   * Also requests access to User Media (audio &| video)
   */
  public connectAgent(agent:AgentInfo):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.connectedAgent = agent;
      this.jsonRpcClient = new JsonRpcClient(this.debug);
      // First we make ensure access to microphone &| camera
      // And wait for the socket to open
      Promise.all([
        MediaChannel.getUserMediaAsChannel({audio: true, video: false}),
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

  /**
   * Start a phone call and return a Call or undefined if an error occured
   */
  public startCall(phoneNumber:string):Call|undefined {
    if (!this.isAgentConnected() || !this.channel || !this.jsonRpcClient) {
      this.sendNotConnectedEvent('start call');
      return;
    }
    if (!PATTERNS.phoneNumber.test(phoneNumber)) {
      ZiwoEvent.emit(ZiwoEventType.Error, {
        code: ErrorCode.InvalidPhoneNumber,
        message: MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
        data: {
          phoneNumber: phoneNumber,
        }
      });
      return;
    }
    this.channel?.startMicrophone();
    const call = this.jsonRpcClient.startCall(phoneNumber, JsonRpcParams.getUuid(), this.channel, this.tags);
    this.calls.push(call);
    return call;
  }

  /**
   * Process message
   */
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
