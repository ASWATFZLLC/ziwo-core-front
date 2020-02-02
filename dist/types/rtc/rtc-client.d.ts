import { AgentInfo } from '../authentication.service';
import { VideoInfo } from './channel';
import { RtcClientHandlers } from './rtc-client.handlers';
export interface MediaConstraint {
    audio: boolean;
    video: boolean;
}
/**
 * RtcClient wraps all interaction with WebRTC
 *
 * Inheritance:
 *  - RtcClientBase: shared properties, getter, setters & errors
 *  - RtcRequests: send new request (start call, answer call, ...)
 *  - RtcHandlers: handler incoming message (call received, outgoing call, ...)
 */
export declare class RtcClient extends RtcClientHandlers {
    constructor(video?: VideoInfo, debug?: boolean);
    /**
     * Connect an agent using its Info
     */
    connectAgent(agent: AgentInfo): Promise<void>;
    private processIncomingSocketMessage;
}
