import {JsonRpcRequests} from './json-rpc.requests';

export enum ZiwoSocketEvent {
  LoggedIn = 'LoggedIn',
  CallCreated = 'CallCreated',
}

/**
 * JsonRpcClient implements Verto protocol using JSON RPC
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
 *      .then(() => {
 *        this.login() // REQUIRED: log the agent into the web socket
 *        // You can now proceed with any requests
 *      });
 *
 */
export class JsonRpcClient extends JsonRpcRequests {

  constructor(debug?:boolean) {
    super(debug);
  }

}
