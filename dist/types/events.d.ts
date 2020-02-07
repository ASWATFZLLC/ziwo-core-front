import { Call } from './call';
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
export interface ZiwoEventHistory {
    state: ZiwoEventDetails;
    date: Date;
    dateUNIX: string;
}
export interface ZiwoEventDetails {
    type: ZiwoEventType;
    direction: 'outbound' | 'inbound';
    callID: string;
    primaryCallID: string;
    customerNumber: string;
    stateFlow: ZiwoEventHistory[];
    currentCall: Call;
}
export declare enum ZiwoErrorCode {
    ProtocolError = 1001,
    MediaError = 1002,
    MissingCall = 1003
}
export declare enum ZiwoEventType {
    Error = "error",
    Connected = "connected",
    Disconnected = "disconnected",
    Requesting = "requesting",
    Trying = "tring",
    Early = "early",
    Ringing = "ringing",
    Answering = "answering",
    Active = "active",
    Held = "held",
    Hangup = "hangup",
    Destroy = "destroy",
    Recovering = "recovering"
}
export declare class ZiwoEvent {
    static listeners: Function[];
    private type;
    private data;
    constructor(type: ZiwoEventType, data: ZiwoEventDetails);
    static subscribe(func: Function): void;
    static emit(type: ZiwoEventType, data: ZiwoEventDetails): void;
    static error(code: ZiwoErrorCode, data: any): void;
    emit(): void;
}
