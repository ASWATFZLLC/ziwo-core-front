import { AgentInfo } from '../authentication.service';
import { MediaChannel, MediaInfo } from '../media-channel';
import { Call } from '../call';
import { VertoParams, VertoByeReason } from './verto.params';
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
     * Media video tags
     */
    tags: MediaInfo;
    /**
     *
     */
    params: VertoParams;
    /**
     * Session ID used with the current socket
     */
    sessid?: string;
    /**
     * User Media Channel
     */
    channel?: MediaChannel;
    /**
     * Our communication channel
     */
    private socket?;
    /**
     * Information about agent
     */
    private position?;
    /**
     * Callback functions - register using `addListener`
     */
    private listeners;
    private orchestrator;
    private cleaner;
    private readonly debug;
    private readonly STUN_ICE_SERVER;
    /**
     * Reference to list of running calls
     */
    readonly calls: Call[];
    constructor(calls: Call[], debug: boolean, tags: MediaInfo);
    /**
     * addListener allows to listen for incoming Socket Event
     */
    addListener(call: Function): void;
    connectAgent(agent: AgentInfo): Promise<AgentInfo>;
    /**
     * send a start call request
     */
    startCall(phoneNumber: string): Call | undefined;
    /**
     * Answer a call
     */
    answerCall(callId: string, phoneNumber: string, sdp: string): void;
    /**
     * Hang up a specific call
     */
    hangupCall(callId: string, phoneNumber: string, reason?: VertoByeReason): void;
    /**
     * Hold a specific call
     */
    holdCall(callId: string, phoneNumber: string): void;
    /**
     * Hang up a specific call
     */
    unholdCall(callId: string, phoneNumber: string): void;
    blindTransfer(transferTo: string, callId: string, phoneNumber: string): void;
    /**
     * Purge a specific call
     */
    purgeCall(callId: string): void;
    /**
     * Destroy a specific call.
     */
    destroyCall(callId: string): void;
    /**
     * Purge & Destroy a specific call.
     */
    purgeAndDestroyCall(callId: string): void;
    /**
     * DTFM send a char to current call
     */
    dtfm(callId: string, char: string): void;
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
    getNewRTCPeerConnection(): RTCPeerConnection;
    /**
     * Concat position to return the login used in Json RTC request
     */
    getLogin(): string;
    protected ensureMediaChannelIsValid(): boolean;
    /**
     * Validate the JSON RPC headersx
     */
    private isJsonRpcValid;
}
