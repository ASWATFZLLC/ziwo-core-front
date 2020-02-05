import { VertoEvent } from './verto.event';
/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
export declare class VertoParser {
    static parse(data: any): VertoEvent;
    private static isLoggedIn;
    private static isOutgoingCall;
    private static isMediaRequest;
}
