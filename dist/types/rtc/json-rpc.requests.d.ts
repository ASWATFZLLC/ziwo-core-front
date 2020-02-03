import { JsonRpcBase } from './json-rpc.base';
import { AgentPosition } from '../authentication.service';
import { Channel, VideoInfo } from './channel';
import { Call } from './call';
export declare class JsonRpcRequests extends JsonRpcBase {
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
    startCall(phoneNumber: string, callId: string, channel: Channel, tags: VideoInfo): Call;
}
