import {AgentInfo} from '../authentication.service';
import {UserMedia} from './userMedia';
import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {Channel, VideoInfo} from './channel';
import {JsonRpcClient} from './json-rpc';
import { JsonRpcEvent, JsonRpcEventType } from './json-rpc.interfaces';


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
  public connectAgent(agent:AgentInfo):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.connectedAgent = agent;
      this.jsonRpcClient = new JsonRpcClient();
      // First we make ensure access to microphone &| camera
      // And wait for the socket to open
      Promise.all([
        UserMedia.getUserMedia({audio: true, video: this.videoInfo ? true : false}),
        this.jsonRpcClient.openSocket(this.connectedAgent.webRtc.socket),
      ]).then(res => {
        this.channel = res[0];
        this.jsonRpcClient?.addListener((ev:JsonRpcEvent) => {
          if (ev.type === JsonRpcEventType.LoggedIn) {
            ZiwoEvent.emit(ZiwoEventType.AgentConnected);
            onRes();
            return;
          }
          // This is our handler to incoming message
          this.processIncomingSocketMessage(ev);
        });
        this.jsonRpcClient?.login(agent.position.name, agent.position.password);
      }).catch(err => {
        onErr(err);
      });
    });
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

  private processIncomingSocketMessage(ev:JsonRpcEvent):void {
    console.log('New incoming message', ev);
  }

  private sendNotConnectedEvent(action:string):void {
    return ZiwoEvent.emit(ZiwoEventType.Error, {
      code: ErrorCode.InvalidPhoneNumber,
      message: MESSAGES.AGENT_NOT_CONNECTED(action),
    });
  }

}
