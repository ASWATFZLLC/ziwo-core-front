import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {JsonRpcParser} from './json-rpc.parser';
import {AgentPosition} from '../authentication.service';
import { JsonRpcParams } from './json-rpc.params';

export enum ZiwoSocketEvent {
  LoggedIn = 'LoggedIn',
  CallCreated = 'CallCreated',
}

interface Credentials {
  login:string;
  passwd:string;
  sessid:string;
}

/**
 * JsonRpcClient provides useful functions to interact with the WebSocket using Verto Protocol
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // Promise opening the web socket
 *      .then(() => {
 *        this.login() // should be called instantely after the socket is opened
 *        // You can now proceed with any requests
 *      });
 *
 */
export class JsonRpcClient {

  private position?:AgentPosition;
  private socket?:WebSocket;
  private sessid?:string;
  private listeners:Function[] = [];

  private readonly debug:boolean;

  constructor(debug?:boolean) {
    this.debug = debug || false;
  }

  /**
   * INITIALIZERS
   *
   * Following functions are used to setup the socket
   */

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
        console.log('New message > ', msg);
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
   * REQUESTS
   *
   * Following functions send a request to the opened socket
   * Following functions do not return the response.
   * Instead, you should use `addListener` and use the Socket Event to follow the status of the request.
   */

  /**
   * login log the agent in the newly created socket
   */
  public login(agentPosition:AgentPosition):Promise<void> {
    this.position = agentPosition;
    return new Promise<void>((onRes, onErr) => {
      if (!this.socket) {
        return onErr();
      }
      this.sessid = JsonRpcParams.getUuid();
      this.send(JsonRpcParams.loginParams(this.sessid, agentPosition.name, agentPosition.password));
    });
  }

  /**
   * send a start call request
   */
  public startCall(phoneNumber:string):void {
    this.send(JsonRpcParams.startCall(this.sessid, this.getLogin(), phoneNumber));
  }

  /**
   * PRIVATE Functions
   */

  /**
   * Send data to socket and log in case of debug
   */
  private send(data:any):void {
    if (this.debug) {
      console.log('Write message > ', JSON.parse(data));
    }
    if (!this.socket) {
      return;
    }
    this.socket.send(data);
  }

  /**
   * Validate the JSON RPC headers
   */
  private isJsonRpcValid(data:any):boolean {
    return typeof data === 'object'
      && 'jsonrpc' in data
      && data.jsonrpc === '2.0';
  }

  /**
   * Concat position to return the login used in Json RTC request
   */
  private getLogin():string {
    return `${this.position?.name}@${this.position?.hostname}`;
  }

}
