import {Credentials, AuthenticationService, AgentInfo, AgentPosition, ManualPosition} from './authentication.service';
import {ApiService} from './api.service';
import {ZiwoEvent, ZiwoEventType} from './events';
import {MediaInfo} from './media-channel';
import {Call} from './call';
import {Verto} from './verto/verto';
import { IOService } from './io';

export interface ZiwoClientOptions {
  /**
   * @contactCenterName is the contact center the agent is working for
   */
  contactCenterName:string;

  /**
   * see `authentication.ts#Credentials` for complete definition
   */
  credentials:Credentials;

  /**
   * @autoConnect let you choose to connect the agent automatically or not.
   * Default = true
   * Error is raised if authentication fails. In case you want to handle failed authentication, run `connect` manually
   */
  autoConnect:boolean;

  /**
   * [DEPRECATED] - use @mediaTag instead
   */
  tags:MediaInfo;

  /**
   * @mediaTag is a DIV element that will contains the HTML media elements used for calls
   * The div must always be available but doesn't have to be visible
   */
  mediaTag:HTMLDivElement;

  /**
   * @debug display log info if set to true
   */
  debug?:boolean;
}

/**
 * Ziwo Client allow your to setup the environment.
 * It will setup the WebRTC, open the WebSocket and do the required authentications
 *
 * See README#Ziwo Client to see how to instanciate a new client.
 * Make sure to wait for `connected` event before doing further action.
 *
 * Once the client is instancied and you received the `connected` event, Ziwo is ready to be used
 * and you can start a call by using `startCall(phoneNumber:string)` or simply wait for events to proc.
 */
export class ZiwoClient {

  /**
   * @connectedAgent provide useful information about the connected user
   * See src/authentication.service.ts#AgentInfo for more details
   */
  public connectedAgent?:AgentInfo;

  public options:ZiwoClientOptions;

  public io:IOService;
  private calls:Call[] = [];
  private apiService:ApiService;
  private verto:Verto;
  private debug:boolean;

  constructor(options:ZiwoClientOptions) {
    this.options = options;
    this.debug = options.debug || false;
    this.apiService = new ApiService(options.contactCenterName);
    this.io = new IOService();
    this.verto = new Verto(this.calls, this.debug, options.mediaTag, this.io);

    if (options.autoConnect) {
      this.connect().then(r => {
      }).catch(err => { throw err; });
    }
  }

  public restart(options:ZiwoClientOptions): void {
    // Drop all
    this.verto.disconnect();
    this.options = options;
    this.debug = options.debug || false;
    this.apiService = new ApiService(options.contactCenterName);
    this.io = new IOService();
    this.verto = new Verto(this.calls, this.debug, options.mediaTag, this.io);
  }

  /**
   * connect authenticate the user over Ziwo & our communication socket
   * This function is required before proceeding with calls
   */
  public connect():Promise<void> {
    return new Promise<any>((onRes, onErr) => {
      AuthenticationService.authenticate(this.apiService, this.options.credentials)
        .then(res => {
          this.connectedAgent = res;
          this.verto.connectAgent(this.connectedAgent, this.options.contactCenterName);
          onRes();
        }).catch(err => onErr(err));
    });
  }

  /**
   * Disconnect user from our socket and stop the protocol
   */
  public disconnect():Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      AuthenticationService.logout(this.apiService).then(((r:any) => {
        this.verto.disconnect();
      })).catch(c => {/* no need to catch error here*/});
    });
  }

  public restartSocket(): void {
    return this.verto.restartSocket();
  }

  /**
   * Add a callback function for all events
   * Can be used instead of `addEventListener`
   * NoteL Event thrown through this support
   * does not include the `ziwo` suffix nor the `_jorel-dialog-state` prefix
   */
  public addListener(func:Function):void {
    return ZiwoEvent.subscribe(func);
  }

  /**
   * Start a phone call with the external phone number provided and return an instance of the Call
   * Note: the call's instance will also be provided in all the events
   */
  public startCall(phoneNumber:string):Call|undefined {
      const call = this.verto.startCall(phoneNumber);
      if (!call) {
        return undefined;
      }
      this.calls.push(call);
      return call;
  }

  /**
   * Start a call using click2call
   * return the call ID if the call is successful or undefined if an issue occured
   */
  public startClick2Call(phoneNumber:string, roaming = false):Promise<string|undefined> {
    return new Promise<string|undefined>((onRes, onErr) => {
      this.apiService.post(`${this.apiService.endpoints.click2Call}/${encodeURIComponent(phoneNumber)}`, {
        roamingOnly: roaming,
      }).then(ok => onRes((ok.content as any).callID)).catch(e => onErr(e));
    });
  }

}
