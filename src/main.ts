import {Credentials, AuthenticationService, AgentInfo} from './authentication.service';
import {RtcClient} from './rtc/rtc-client';
import {ApiService} from './api.service';
import {ZiwoEvent, ZiwoEventType} from './events';
import {VideoInfo} from './rtc/channel';

/**
 * ziwo-core-front provides a client for real time communication using WebRTC integrated with Ziwo
 */

export interface ZiwoClientOptions {
  /**
   * @contactCenterName is the contact center the agent is working for
   */
  contactCenterName:string;

  /**
   * see `authentication.ts#Credentials` for complete definition
   * If `credentials` is not provided, please provide an Authentication Token
   */
  credentials:Credentials;

  /**
   * @autoConnect let you choose to connect the agent automatically or not.
   * Default = true
   * Error is raised if authentication fails. In case you want to handle failed authentication, run `connect` manually
   */
  autoConnect:boolean;

  /**
   *
   */
  video?:VideoInfo;

  debug?:boolean;
}

export class ZiwoClient {

  public readonly options:ZiwoClientOptions;

  private apiService:ApiService;
  private rtcClient:RtcClient;

  constructor(options:ZiwoClientOptions) {
    this.options = options;
    this.apiService = new ApiService(options.contactCenterName);
    this.rtcClient = new RtcClient(options.video, options.debug);
    if (options.autoConnect) {
      this.connect().then(r => {
      }).catch(err => { throw err; });
    }
  }

  public connect():Promise<AgentInfo> {
    return new Promise<any>((onRes, onErr) => {
      AuthenticationService.authenticate(this.apiService, this.options.credentials)
        .then(res => {
          this.rtcClient.connectAgent(res);
          onRes(res);
        }).catch(err => onErr(err));
    });
  }

  public addListener(func:Function):void {
    return ZiwoEvent.subscribe(func);
  }

  public startCall(phoneNumber:string):void {
    this.rtcClient.startCall(phoneNumber);
  }

}
