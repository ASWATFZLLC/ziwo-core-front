import {Credentials, AuthenticationService, AgentInfo} from './authentication.service';
import {ApiService} from './api.service';
import {ZiwoEvent, ZiwoEventType} from './events';
import {MediaInfo} from './media-channel';
import {Call} from './call';
import {Verto} from './verto/verto';

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
   * @tags
   */
  tags:MediaInfo;

  debug?:boolean;
}

export class ZiwoClient {

  public readonly options:ZiwoClientOptions;

  private connectedAgent?:AgentInfo;
  private apiService:ApiService;
  private verto:Verto;
  private readonly debug:boolean ;
  // private rtcClient:RtcClient;

  constructor(options:ZiwoClientOptions) {
    this.options = options;
    this.debug = options.debug || false;
    this.apiService = new ApiService(options.contactCenterName);
    this.verto = new Verto(this.debug);

    if (options.autoConnect) {
      this.connect().then(r => {
      }).catch(err => { throw err; });
    }
  }

  public connect():Promise<AgentInfo> {
    return new Promise<any>((onRes, onErr) => {
      AuthenticationService.authenticate(this.apiService, this.options.credentials)
        .then(res => {
          this.verto.connectAgent(res);
          onRes(res);
        }).catch(err => onErr(err));
    });
  }

  public addListener(func:Function):void {
    return ZiwoEvent.subscribe(func);
  }

  public startCall(phoneNumber:string):Call|undefined {
    return this.verto.startCall(phoneNumber);
  }

}
