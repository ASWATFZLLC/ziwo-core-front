import {AgentInfo} from '../authentication.service';
import {MediaChannel, MediaInfo} from './media-channel';
import {Call} from './call';
import {ZiwoEventType, ZiwoEvent, ErrorCode} from '../events';
import {MESSAGES} from '../messages';
import {Verto} from './verto';

/**
 * RtcClientBase handles authentication and holds core properties
 */
export class RtcClientBase {

  public connectedAgent?:AgentInfo;
  public channel?:MediaChannel;
  public tags:MediaInfo;
  public verto?:Verto;
  public currentCall?:Call;
  public calls:Call[] = [];
  protected readonly debug:boolean;

  constructor(tags:MediaInfo, debug?:boolean) {
    this.debug = debug || false;
    this.tags = tags;
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
