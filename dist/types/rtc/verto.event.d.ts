export interface VertoEvent {
    type: VertoEventType;
    raw: any;
    payload: any;
}
export declare enum VertoEventType {
    Unknown = "Unknown",
    LoggedIn = "LoggedIn",
    OutgoingCall = "OutgoingCall",
    MediaRequest = "MediaRequest"
}
