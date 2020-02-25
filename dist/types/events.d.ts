import { Call, CallState } from './call';
/**
 * TODO : documentation
 */
export declare enum ErrorCode {
    InvalidPhoneNumber = 2,
    UserMediaError = 3,
    AgentNotConnected = 1,
    ProtocolError = 4
}
export interface ErrorData {
    code: ErrorCode;
    message: string;
    data?: any;
}
export interface ZiwoEventDetails {
    type: ZiwoEventType;
    currentCall: Call;
    callID: string;
    primaryCallID?: string;
    customerNumber: string;
    direction: 'outbound' | 'inbound' | 'internal' | 'service';
    stateFlow: CallState[];
    [key: string]: any;
}
export declare enum ZiwoErrorCode {
    ProtocolError = 1001,
    MediaError = 1002,
    MissingCall = 1003,
    CannotCreateCall = 1004
}
export declare enum ZiwoEventType {
    Error = "error",
    Connected = "connected",
    Disconnected = "disconnected",
    Requesting = "requesting",
    Trying = "trying",
    Early = "early",
    Ringing = "ringing",
    Answering = "answering",
    Active = "active",
    Held = "held",
    Hangup = "hangup",
    Mute = "mute",
    Unmute = "unmute",
    Purge = "purge",
    Destroy = "destroy",
    Recovering = "recovering"
}
export declare class ZiwoEvent {
    static listeners: Function[];
    private static prefixes;
    private type;
    private data;
    constructor(type: ZiwoEventType, data: ZiwoEventDetails);
    static subscribe(func: Function): void;
    static emit(type: ZiwoEventType, data: ZiwoEventDetails): void;
    static error(code: ZiwoErrorCode, data: any): void;
    private static dispatchEvents;
    emit(): void;
}
