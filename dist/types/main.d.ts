import { Credentials } from './authentication.service';
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
     * If `credentials` is not provided, please provide an Authentication Token
     */
    credentials: Credentials;
    /**
     * @autoConnect let you choose to connect the agent automatically or not.
     * Default = true
     * Error is raised if authentication fails. In case you want to handle failed authentication, run `connect` manually
     */
    autoConnect: boolean;
}
export declare class ZiwoClient {
    readonly options: ZiwoClientOptions;
    private apiService;
    private rtcClient;
    constructor(options: ZiwoClientOptions);
    connect(): Promise<any>;
    addListener(func: Function): void;
    startCall(phoneNumber: string): void;
}
