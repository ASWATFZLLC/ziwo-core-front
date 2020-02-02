import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {JsonRpcEvent, JsonRpcEventType, JsonRpcBuilder} from './json-rpc.interfaces';
import {JsonRpcParser} from './json-rpc.parser';

export enum ZiwoSocketEvent {
  LoggedIn = 'LoggedIn',
}

interface Credentials {
  login:string;
  passwd:string;
  sessid:string;
}

export class JsonRpcClient {

  private socket?:WebSocket;
  private sessid?:string;
  private listeners:Function[] = [];

  constructor() {}

  public openSocket(socketUrl:string):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.socket = new WebSocket(socketUrl);
      this.socket.onclose = () => {
        console.warn('Socket closed');
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
          this.listeners.forEach(fn => {
            const d = this.parseMessage(data);
            if (d) {
              fn(d);
            }
          });
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

  public login(login:string, password:string):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      if (!this.socket) {
        return onErr();
      }
      this.socket.send(this.loginParams({
        login,
        passwd: password,
        sessid: this.getUuid(),
      }));
    });
  }

  public addListener(call:Function):void {
    this.listeners.push(call);
  }

  private parseMessage(data:any):JsonRpcEvent|undefined {

    switch (JsonRpcParser.parse(data)) {
      case JsonRpcEventType.LoggedIn:
        return JsonRpcBuilder.loggedIn(data);
      case JsonRpcEventType.Unknown:
        // Unknown are not useful message - we skip them
        // TODO : add a specific trigger system for those?
        break;
    }
    return undefined;
  }

  private isJsonRpcValid(data:any):boolean {
    return typeof data === 'object'
      && 'jsonrpc' in data
      && data.jsonrpc === '2.0';
  }

  private getUuid():string {
    /* tslint:disable */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    /* tslint:enable */
    });
  }

  /**
   * REQUEST
   */
  private loginParams(credentials:Credentials):string {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'login',
      params: credentials,
      id: 3,
    });
  }

}
