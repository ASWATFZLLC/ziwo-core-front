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
    readonly rtcPeerConnection: RTCPeerConnection;
    readonly channel: MediaChannel;
    readonly verto: Verto;
    readonly phoneNumber: string;
    readonly direction: 'outbound' | 'inbound';
    readonly states: CallState[];
    private status;
    private readonly outboundDetails?;
    constructor(callId: string, verto: Verto, phoneNumber: string, login: string, direction: 'outbound' | 'inbound', outboundDetails?: any);
    getCallStatus(): CallComponentsStatus;
    answer(): Promise<void>;
    hangup(): void;
    hold(): void;
    unhold(): void;
    mute(): void;
    unmute(): void;
    pushState(type: ZiwoEventType, broadcast?: boolean): void;
    private toggleSelfStream;
}
