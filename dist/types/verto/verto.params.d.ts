export declare enum VertoMethod {
    Login = "login",
    ClientReady = "verto.clientReady",
    Attach = "verto.attach",
    Media = "verto.media",
    Invite = "verto.invite",
    Answer = "verto.answer",
    Info = "verto.info",
    Modify = "verto.modify",
    Display = "verto.display",
    Bye = "verto.bye"
}
export declare enum VertoByeReason {
    NORMAL_CLEARING = 16,
    CALL_REJECTED = 21,
    ORIGINATOR_CANCEL = 487
}
export declare enum VertoState {
    Hold = "hold",
    Unhold = "unhold",
    Purge = "purge"
}
export declare enum VertoNotificationMessage {
    CallCreated = "CALL CREATED",
    CallEnded = "CALL ENDED"
}
export interface VertoMessage<T> {
    jsonrpc: '2.0';
    method: VertoMethod;
    id: number;
    params: T;
}
export interface VertoNotification<T> {
    jsonrpc: '2.0';
    method: VertoMethod;
    id: number;
    result: T;
}
export interface VertoLogin {
}
export declare class VertoParams {
    private id;
    wrap(method: string, params?: any, id?: number): VertoMessage<any>;
    login(sessid: string, login: string, passwd: string): VertoMessage<any>;
    startCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): VertoMessage<any>;
    hangupCall(sessionId: string, callId: string, login: string, phoneNumber: string, reason?: VertoByeReason): VertoMessage<any>;
    answerCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): VertoMessage<any>;
    setState(sessionId: string, callId: string, login: string, phoneNumber: string, state: VertoState): VertoMessage<any>;
    transfer(sessionId: string, callId: string, login: string, phoneNumber: string, transferTo: string): VertoMessage<any>;
    dtfm(sessionId: string, callId: string, login: string, char: string): VertoMessage<any>;
    getUuid(): string;
    static getUuid(): string;
    private dialogParams;
}
