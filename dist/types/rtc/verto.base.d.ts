import { AgentPosition } from '../authentication.service';
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
export declare class VertoBase {
    /**
     * Our communication channel
     */
    protected socket?: WebSocket;
    /**
     * Session ID used with the current socket
     */
    protected sessid?: string;
    /**
     * Information about agent
     */
    protected position?: AgentPosition;
    /**
     * Callback functions - register using `addListener`
     */
    protected listeners: Function[];
    protected readonly debug: boolean;
    constructor(debug?: boolean);
    /**
     * addListener allows to listen for incoming Socket Event
     */
    addListener(call: Function): void;
    /**
     * openSocket should be called directly after the constructor
     * It initializate the socket and set the handlers
     */
    openSocket(socketUrl: string): Promise<void>;
    /**
     * Send data to socket and log in case of debug
     */
    send(data: any): void;
    /**
     * Concat position to return the login used in Json RTC request
     */
    protected getLogin(): string;
    /**
     * Validate the JSON RPC headersx
     */
    private isJsonRpcValid;
}
