import { MediaChannel } from './media-channel';
import { Verto } from './verto/verto';
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
    readonly jsonRpcClient: Verto;
    readonly phoneNumber: string;
    private status;
    constructor(callId: string, jsonRpcClient: Verto, rtcPeerConnection: RTCPeerConnection, channel: MediaChannel, phoneNumber: string);
    getCallStatus(): CallComponentsStatus;
    answer(): void;
    hangup(): void;
    hold(): void;
    unhold(): void;
    mute(): void;
    unmute(): void;
    private toggleSelfStream;
}
