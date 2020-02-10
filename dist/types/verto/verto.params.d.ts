export declare enum VertoMethod {
    Login = "login",
    ClientReady = "verto.clientReady",
    Media = "verto.media",
    Invite = "verto.invite",
    Answer = "verto.answer",
    Modify = "verto.modify",
    Display = "verto.display",
    Bye = "verto.bye"
}
export declare enum VertoAction {
    Hold = "hold",
    Unhold = "unhold"
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
    hangupCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoMessage<any>;
    holdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoMessage<any>;
    unholdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoMessage<any>;
    answerCall(sessionId: string | undefined, callId: string, sdp: string): VertoMessage<any>;
    getUuid(): string;
    private dialogParams;
}
