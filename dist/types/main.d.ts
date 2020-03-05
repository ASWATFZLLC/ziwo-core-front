import { Credentials } from './authentication.service';
import { MediaInfo } from './media-channel';
import { Call } from './call';
/**
 * ziwo-core-front provides a client for real time communication using WebRTC integrated with Ziwo
 */
export interface ZiwoClientOptions {
    /**
     * @contactCenterName is the contact center the agent is working for
     */
    contactCenterName: string;
    /**
     * see `authentication.ts#Credentials` for complete definition
     */
    credentials: Credentials;
    /**
     * @autoConnect let you choose to connect the agent automatically or not.
     * Default = true
     * Error is raised if authentication fails. In case you want to handle failed authentication, run `connect` manually
     */
    autoConnect: boolean;
    /**
     * @tags
     */
    tags: MediaInfo;
    debug?: boolean;
}
export declare class ZiwoClient {
    readonly options: ZiwoClientOptions;
    private readonly calls;
    private connectedAgent?;
    private apiService;
    private verto;
    private readonly debug;
    constructor(options: ZiwoClientOptions);
    /**
     * connect authenticate the user over Ziwo & our communication socket
     * This function is required before proceeding with calls
     */
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    addListener(func: Function): void;
    startCall(phoneNumber: string): Call | undefined;
}
