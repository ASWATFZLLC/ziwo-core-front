import { AgentPosition } from '../authentication.service';
import { MediaChannel, MediaInfo } from './media-channel';
import { Call } from './call';
import { JsonRpcBase } from './json-rpc.base';
export declare enum ZiwoSocketEvent {
    LoggedIn = "LoggedIn",
    CallCreated = "CallCreated"
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
export declare class JsonRpcClient extends JsonRpcBase {
    private readonly ICE_SERVER;
    constructor(debug?: boolean);
    /**
     * Following functions send a request to the opened socket. They do not return the result of the request
     * Instead, you should use `addListener` and use the Socket events to follow the status of the request.
     */
    /**
     * login log the agent in the newly created socket
     */
    login(agentPosition: AgentPosition): Promise<void>;
    /**
     * send a start call request
     */
    startCall(phoneNumber: string, callId: string, channel: MediaChannel, tags: MediaInfo): Call;
}
