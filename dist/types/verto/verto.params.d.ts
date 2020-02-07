export declare enum VertoMethod {
    Login = "login",
    ClientReady = "verto.clientReady",
    Media = "verto.media",
    Invite = "verto.invite",
    Modify = "verto.modify",
    Bye = "verto.bye"
}
export interface VertoRequest<T> {
    jsonrpc: '2.0';
    method: VertoMethod;
    id: number;
    params: T;
}
export interface VertoMessage<T, P> {
    jsonrpc: '2.0';
    method: VertoMethod;
    id: number;
    params: P;
    result: T;
}
export interface VertoLogin {
}
export declare class VertoParams {
    private id;
    wrap(method: string, params?: any, id?: number): VertoRequest<any>;
    login(sessid: string, login: string, passwd: string): VertoRequest<any>;
    startCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): VertoRequest<any>;
    hangupCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    holdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    unholdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    getUuid(): string;
    private dialogParams;
}
