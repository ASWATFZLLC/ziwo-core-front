import {AgentPosition} from '../authentication.service';
import {JsonRpcParser} from './json-rpc.parser';
import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';

export class JsonRpcBase {

  /**
   * Our communication channel
   */
  protected socket?:WebSocket;

  /**
   * Session ID used with the current socket
   */
  protected sessid?:string;

  /**
   * Information about agent
   */
  protected position?:AgentPosition;

  /**
   * Callback functions - register using `addListener`
   */
  protected listeners:Function[] = [];


  protected readonly debug:boolean;

  constructor(debug?:boolean) {
    this.debug = debug || false;
  }

  /**
   * addListener allows to listener for incoming Socket Event
   */
  public addListener(call:Function):void {
    this.listeners.push(call);
  }

  /**
   * openSocket should be called directly after the constructor
   * It initializate the socket and set the handlers
   */
  public openSocket(socketUrl:string):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.socket = new WebSocket(socketUrl);
      this.socket.onclose = () => {
        if (this.debug) {
          console.warn('Socket closed');
        }
      };
      this.socket.onopen = () => {
        onRes();
      };
      this.socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (!this.isJsonRpcValid) {
            throw new Error('Invalid Incoming JSON RPC');
          }
          this.listeners.forEach(fn => fn(JsonRpcParser.parse(data)));
        } catch (err) {
          console.warn('Invalid Message', msg);
          // NOTE : not sure if we should throw an error here -- need live testing to enable/disable
          ZiwoEvent.emit(ZiwoEventType.Error, {
            code: ErrorCode.ProtocolError,
            message: err,
          });
        }
      };
    });
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
   * Concat position to return the login used in Json RTC request
   */
  protected getLogin():string {
    return `${this.position?.name}@${this.position?.hostname}`;
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
