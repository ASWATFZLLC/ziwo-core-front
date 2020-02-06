import { MediaChannel } from './media-channel';
import { JsonRpcClient } from './json-rpc';
export declare enum CallStatus {
    Stopped = "stopped",
    Running = "running",
    OnHold = "onHold"
}
export interface CallComponentsStatus {
    call: CallStatus;
    microphone: CallStatus;
    camera: CallStatus;
}
/**
 * Call holds a call information and provide helpers
 */
export declare class Call {
    readonly callId: string;
    readonly rtcPeerConnection: RTCPeerConnection;
    readonly channel: MediaChannel;
    readonly jsonRpcClient: JsonRpcClient;
    readonly phoneNumber: string;
    private status;
    constructor(callId: string, jsonRpcClient: JsonRpcClient, rtcPeerConnection: RTCPeerConnection, channel: MediaChannel, phoneNumber: string);
    getCallStatus(): CallComponentsStatus;
    answer(): void;
    hangup(): void;
    hold(): void;
    unhold(): void;
    mute(): void;
    unmute(): void;
    private toggleSelfStream;
}
