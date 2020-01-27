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
    credentials?: Credentials;
    /**
     * @authenticationToken is the token provided by the /login API
     * If not provided, please provide credentials
     */
    authenticationToken?: string;
    /**
     * @autoConnect let you choose to connect the agent automatically or not.
     * Default = true
     */
    autoConnect: boolean;
}
export declare class ZiwoClient {
    private apiService;
    private rtcClient;
    constructor(params: ZiwoClientOptions);
    connect(): Promise<any>;
    StartConnect(): void;
}
