import { AgentInfo } from '../authentication.service';
import { Channel, VideoInfo } from './channel';
export interface MediaConstraint {
    audio: boolean;
    video: boolean;
}
/**
 * RtcClient wraps all interaction with WebRTC
 */
export declare class RtcClient {
    connectedAgent?: AgentInfo;
    channel?: Channel;
    videoInfo?: VideoInfo;
    constructor(video?: VideoInfo);
    /**
     * Connect an agent using its Info
     */
    connectAgent(agent: AgentInfo): void;
    /**
     * Get connected Agent returns the Info of the current agent
     */
    getConnectedAgent(): AgentInfo | undefined;
    /**
     * Return true if an agent is connected
     */
    isAgentConnected(): boolean;
    startCall(phoneNumber: string): void;
    private sendNotConnectedEvent;
}
