export declare enum JsonRpcMethod {
    login = "login",
    invite = "verto.invite"
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
    static wrapParams(method: string, id?: number, params?: any): JsonRpcRequest<any>;
    static loginParams(sessid: string, login: string, passwd: string): JsonRpcRequest<any>;
    static startCall(sessionId: string | undefined, callId: string, login: string, phoneNumber: string, sdp: string): JsonRpcRequest<any>;
    static getUuid(): string;
}
