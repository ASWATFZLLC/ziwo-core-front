import {AgentInfo} from '../authentication.service';
import {Channel, VideoInfo} from './channel';
import {JsonRpcClient} from './json-rpc';
import {Call} from './call';
import {ZiwoEventType, ZiwoEvent, ErrorCode} from '../events';
import {MESSAGES} from '../messages';

/**
 * RtcClientBase handles authentication and holds core properties
 */
export class RtcClientBase {

  public connectedAgent?:AgentInfo;
  public channel?:Channel;
  public videoInfo?:VideoInfo;
  public jsonRpcClient?:JsonRpcClient;
  public currentCall?:Call;
  public calls:Call[] = [];
  protected readonly debug:boolean;

  constructor(video?:VideoInfo, debug?:boolean) {
    this.debug = debug || false;
    if (video) {
      this.videoInfo = video;
    }
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

  protected sendNotConnectedEvent(action:string):void {
    return ZiwoEvent.emit(ZiwoEventType.Error, {
      code: ErrorCode.InvalidPhoneNumber,
      message: MESSAGES.AGENT_NOT_CONNECTED(action),
    });
  }

}
