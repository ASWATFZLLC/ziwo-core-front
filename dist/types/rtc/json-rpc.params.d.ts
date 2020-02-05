export declare enum JsonRpcMethod {
    login = "login",
    invite = "verto.invite",
    bye = "verto.bye"
}
export declare enum JsonRpcActionId {
    login = 3,
    invite = 4
}
export interface JsonRpcRequest<T> {
    jsonrpc: '2.0';
    method: JsonRpcMethod;
    id: number;
    params: T;
}
export declare class JsonRpcParams {
    static wrap(method: string, id?: number, params?: any): JsonRpcRequest<any>;
    static login(sessid: string, login: string, passwd: string): JsonRpcRequest<any>;
    static startCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): JsonRpcRequest<any>;
    static hangupCall(sessionid: string, callId: string, login: string, phoneNumber: string): JsonRpcRequest<any>;
    static getUuid(): string;
}
