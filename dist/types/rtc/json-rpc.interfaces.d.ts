export interface JsonRpcEvent {
    type: JsonRpcEventType;
    raw: any;
    payload: any;
}
export declare enum JsonRpcEventType {
    Unknown = "Unknown",
    LoggedIn = "LoggedIn",
    OutgoingCall = "OutgoingCall",
    MediaRequest = "MediaRequest"
}
export interface BasePayload {
    sessid: string;
}
export interface LoggedInPayload extends BasePayload {
}
export interface OutgoingCallPayload extends BasePayload {
    callID: string;
    message: string;
}
export interface MediaRequestPayload extends BasePayload {
    callID: string;
    sdp: string;
}
