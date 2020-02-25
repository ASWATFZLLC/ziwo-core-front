import { MediaChannel } from './media-channel';
import { Verto } from './verto/verto';
import { ZiwoEventType } from './events';
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
export interface CallState {
    state: ZiwoEventType;
    date: Date;
    dateUNIX: number;
}
/**
 * Call holds a call information and provide helpers
 */
export declare class Call {
    readonly callId: string;
    readonly primaryCallId?: string;
    readonly rtcPeerConnection: RTCPeerConnection;
    readonly channel: MediaChannel;
    readonly verto: Verto;
    readonly phoneNumber: string;
    readonly direction: 'outbound' | 'inbound' | 'internal' | 'service';
    readonly states: CallState[];
    private status;
    private readonly initialPayload?;
    constructor(callId: string, verto: Verto, phoneNumber: string, login: string, rtcPeerConnection: RTCPeerConnection, direction: 'outbound' | 'inbound', initialPayload?: any);
    getCallStatus(): CallComponentsStatus;
    answer(): void;
    hangup(): void;
    dtfm(char: string): void;
    hold(): void;
    unhold(): void;
    mute(): void;
    unmute(): void;
    pushState(type: ZiwoEventType, broadcast?: boolean): void;
    private toggleSelfStream;
}
