interface Credentials {
  login:string;
  passwd:string;
  sessid:string;
}

export class JsonRpcClient {

  private socket:WebSocket;
  private credentials:Credentials;

  constructor(socketUrl:string, login:string, password:string) {
    this.socket = new WebSocket(socketUrl);
    this.addSocketHandlers(this.socket);
    this.credentials = {
      login: login,
      passwd: password,
      sessid: this.getUuid(),
    };
  }

  private addSocketHandlers(socket:WebSocket):void {
    socket.onclose = () => {
      console.warn('Socket closed');
    };
    socket.onopen = () => {
      this.login(socket);
    };
    socket.onmessage = (data) => {
      console.log('socket message', data);
    };
  }

  private login(socket:WebSocket):void {
    socket.send(this.loginParams(this.credentials));
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
  public loginParams(credentials:Credentials):string {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'login',
      params: credentials,
      id: 3,
    });
  }

}
