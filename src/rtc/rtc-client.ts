import {AgentInfo} from '../authentication.service';
import {UserMedia} from './userMedia';
import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {Channel, VideoInfo} from './channel';
import {JsonRpcClient} from './json-rpc';

export interface MediaConstraint {
  audio:boolean;
  video:boolean;
}

/**
 * RtcClient wraps all interaction with WebRTC
 */
export class RtcClient {

  public connectedAgent?:AgentInfo;
  public channel?:Channel;
  public videoInfo?:VideoInfo;
  public jsonRpcClient?:JsonRpcClient;

  constructor(video?:VideoInfo) {
    if (video) {
      this.videoInfo = video;
    }
  }

  /**
   * Connect an agent using its Info
   */
  public connectAgent(agent:AgentInfo):void {
    console.log('Init RTC with > ', agent);
    this.connectedAgent = agent;
    UserMedia.getUserMedia({audio: true, video: this.videoInfo ? true : false})
      .then(c => {
        this.channel = c;
        ZiwoEvent.emit(ZiwoEventType.AgentConnected);
      }).catch(e => {
        ZiwoEvent.emit(ZiwoEventType.Error, {
          code: ErrorCode.UserMediaError,
          message: e,
        });
      });
    this.jsonRpcClient = new JsonRpcClient(
      this.connectedAgent.webRtc.socket,
      this.connectedAgent.position.name,
      this.connectedAgent.position.password
    );
  }

  /**
   * Get connected Agent returns the Info of the current agent
   */
  public getConnectedAgent():AgentInfo|undefined {
    return this.connectedAgent;
  }

  /**
   * Return true if an agent is connected
   */
  public isAgentConnected():boolean {
    return !! this.connectedAgent && !! this.channel;
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
    // this.jsonRpcClient.startCall();
    ZiwoEvent.emit(ZiwoEventType.OutgoingCall, {
      audio: true,
      video: false,
    });
  }

  public startVideoCall(phoneNumber:string):void {
    if (!this.isAgentConnected() || !this.channel) {
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
    if (this.videoInfo && this.videoInfo.selfTag) {
      this.channel.bindVideo(this.videoInfo.selfTag);
    }
    ZiwoEvent.emit(ZiwoEventType.OutgoingCall, {
      audio: true,
      video: true,
    });
  }

  private sendNotConnectedEvent(action:string):void {
    return ZiwoEvent.emit(ZiwoEventType.Error, {
      code: ErrorCode.InvalidPhoneNumber,
      message: MESSAGES.AGENT_NOT_CONNECTED(action),
    });
  }

}
