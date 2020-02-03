import { AgentInfo } from '../authentication.service';
import { MediaInfo } from './media-channel';
import { RtcClientHandlers } from './rtc-client.handlers';
import { Call } from './call';
export interface MediaConstraint {
    audio: boolean;
    video: boolean;
}
/**
 * RtcClient wraps all interaction with WebRTC
 * It holds the validation & all properties required for usage of Web RTC
 */
export declare class RtcClient extends RtcClientHandlers {
    constructor(tags: MediaInfo, debug?: boolean);
    /**
     * User Agent Info to authenticate on the socket
     * Also requests access to User Media (audio &| video)
     */
    connectAgent(agent: AgentInfo): Promise<void>;
    /**
     * Start a phone call and return a Call or undefined if an error occured
     */
    startCall(phoneNumber: string): Call | undefined;
    /**
     * Process message
     */
    private processIncomingSocketMessage;
}
