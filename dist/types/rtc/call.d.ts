import { MediaChannel } from './media-channel';
/**
 * Call holds a call information and provide helpers
 */
export declare class Call {
    readonly callId: string;
    readonly rtcPeerConnection: RTCPeerConnection;
    readonly channel: MediaChannel;
    constructor(callId: string, rtcPeerConnection: RTCPeerConnection, channel: MediaChannel);
    answer(): void;
    hangup(): void;
    mute(): void;
    unmute(): void;
    hold(): void;
}
