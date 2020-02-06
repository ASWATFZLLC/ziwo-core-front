import { AgentInfo } from '../authentication.service';
import { MediaInfo } from '../media-channel';
import { Call } from '../call';
/**
 * JsonRpcClient implements Verto protocol using JSON RPC
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
 *      .then(() => {
 *        this.login() // REQUIRED: log the agent into the web socket
 *        // You can now proceed with any requests
 *      });
 *
 */
export declare class Verto {
    /**
     * Our communication channel
     */
    private socket?;
    /**
     * Session ID used with the current socket
     */
    private sessid?;
    /**
     * Information about agent
     */
    private position?;
    /**
     * Callback functions - register using `addListener`
     */
    private listeners;
    /**
     * User Media Channel
     */
    private channel?;
    /**
     * Media video tags
     */
    private tags;
    /**
     *
     */
    private orchestrator;
    /**
     *
     */
    private params;
    private readonly debug;
    private readonly ICE_SERVER;
    constructor(debug: boolean, tags: MediaInfo);
    /**
     * addListener allows to listen for incoming Socket Event
     */
    addListener(call: Function): void;
    connectAgent(agent: AgentInfo): Promise<AgentInfo>;
    /**
     * send a start call request
     */
    startCall(phoneNumber: string): Call;
    /**
     * Hang up a specific call
     */
    hangupCall(callId: string, phoneNumber: string): void;
    /**
     * Hold a specific call
     */
    holdCall(callId: string, phoneNumber: string): void;
    /**
     * Hang up a specific call
     */
    unholdCall(callId: string, phoneNumber: string): void;
    /**
     * Send data to socket and log in case of debug
     */
    send(data: any): void;
    /**
     * login log the agent in the newly created socket
     */
    private login;
    /**
     * openSocket should be called directly after the constructor
     * It initializate the socket and set the handlers
     */
    private openSocket;
    /**
     * Concat position to return the login used in Json RTC request
     */
    protected getLogin(): string;
    protected ensureMediaChannelIsValid(): boolean;
    /**
     * Validate the JSON RPC headersx
     */
    private isJsonRpcValid;
}
