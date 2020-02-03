import { JsonRpcEvent } from './json-rpc.interfaces';
/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
export declare class JsonRpcParser {
    static parse(data: any): JsonRpcEvent;
    private static isLoggedIn;
    private static isOutgoingCall;
    private static isMediaRequest;
}
