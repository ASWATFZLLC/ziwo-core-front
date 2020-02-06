/**
 * TODO : documentation
 * TODO : define interface for each available type?
 * TODO : define all event type
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
export declare enum ZiwoEventType {
    Error = "Error",
    AgentConnected = "AgentConnected",
    IncomingCall = "IncomingCall",
    IncomingCallAnswered = "IncomingCallAnswered",
    OutgoingCall = "OutgoingCall",
    OutgoingCallAnsweredByRemote = "OutgoingCallAnsweredByRemote",
    CallStarted = "CallStarted",
    CallEndedByUser = "CallEndedByUser",
    CallEndedByPeer = "CallEndedByPeer",
    CallRecovering = "CallRecovering"
}
export declare enum JorelEvent {
    IncomingCall = "IncomingCall",
    IncomingCallAnswered = "IncomingCallAnswered",
    OutgoingCall = "requesting",
    OutgoingCallRinging = "trying",
    OutgoingCallAnsweredByRemote = "OutgoingCallAnsweredByRemote",
    CallStarted = "CallStarted",
    CallEndedByUser = "CallEndedByUser",
    CallEndedByPeer = "CallEndedByPeer"
}
export declare class ZiwoEvent {
    static listeners: Function[];
    static subscribe(func: Function): void;
    static emit(type: ZiwoEventType, data?: any): void;
}
