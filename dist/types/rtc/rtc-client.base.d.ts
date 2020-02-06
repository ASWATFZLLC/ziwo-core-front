import { AgentInfo } from '../authentication.service';
import { MediaChannel, MediaInfo } from './media-channel';
import { Call } from './call';
import { Verto } from './verto';
/**
 * RtcClientBase handles authentication and holds core properties
 */
export declare class RtcClientBase {
    connectedAgent?: AgentInfo;
    channel?: MediaChannel;
    tags: MediaInfo;
    verto?: Verto;
    currentCall?: Call;
    calls: Call[];
    protected readonly debug: boolean;
    constructor(tags: MediaInfo, debug?: boolean);
    /**
     * Get connected Agent returns the Info of the current agent
     */
    getConnectedAgent(): AgentInfo | undefined;
    /**
     * Return true if an agent is connected
     */
    isAgentConnected(): boolean;
    protected sendNotConnectedEvent(action: string): void;
}
