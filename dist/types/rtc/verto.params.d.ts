export declare enum VertoMethod {
    login = "login",
    invite = "verto.invite",
    modify = "verto.modify",
    bye = "verto.bye"
}
export interface VertoRequest<T> {
    jsonrpc: '2.0';
    method: VertoMethod;
    id: number;
    params: T;
}
export declare class VertoParams {
    static wrap(method: string, id?: number, params?: any): VertoRequest<any>;
    static login(sessid: string, login: string, passwd: string): VertoRequest<any>;
    static startCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): VertoRequest<any>;
    static hangupCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    static holdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    static unholdCall(sessionId: string, callId: string, login: string, phoneNumber: string): VertoRequest<any>;
    static getUuid(): string;
    private static dialogParams;
}
