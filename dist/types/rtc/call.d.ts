import { MediaChannel } from './media-channel';
import { JsonRpcClient } from './json-rpc';
/**
 * Call holds a call information and provide helpers
 */
export declare class Call {
    readonly callId: string;
    readonly rtcPeerConnection: RTCPeerConnection;
    readonly channel: MediaChannel;
    readonly jsonRpcClient: JsonRpcClient;
    readonly phoneNumber: string;
    constructor(callId: string, jsonRpcClient: JsonRpcClient, rtcPeerConnection: RTCPeerConnection, channel: MediaChannel, phoneNumber: string);
    answer(): void;
    hangup(): void;
    mute(): void;
    unmute(): void;
    hold(): void;
}
