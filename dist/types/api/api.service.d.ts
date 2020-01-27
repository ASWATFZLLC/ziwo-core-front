export interface ApiEndpoint {
    authenticate: string;
}
export declare class ApiService {
    readonly endpoints: ApiEndpoint;
    private readonly url;
    private readonly httpClient;
    constructor(contactCenterName: string);
    /**
     * Set Authorization token for further requests
     */
    setToken(): void;
    get<T>(endpoint: string): Promise<T>;
}
