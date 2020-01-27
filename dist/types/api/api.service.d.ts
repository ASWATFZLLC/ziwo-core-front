export interface ApiResult<T> {
    result: boolean;
    info: any;
    content: T;
}
export interface AsyncApiResult<T> extends Promise<ApiResult<T>> {
}
/**
 * ApiService wraps the axios to provide quick GET, POST, PUT and DELETE
 *
 * Usage:
 *
 *  const apiService = new ApiService('kalvad-poc'); // contact center name you want to connect to
 *  apiService.get<User>(apiService.endpoints.authenticate) ; // ApiService already defined the endpoints available on Ziwo API
 *    .then( (e) => console.log('User > ', e.data)); // Request object is available under `data`;
 */
export declare class ApiService {
    readonly endpoints: any;
    private token?;
    private readonly baseUrl;
    private readonly API_PROTOCOL;
    private readonly API_PREFIX;
    constructor(contactCenterName: string);
    /**
     * Set Authorization token for further requests
     */
    setToken(token: string): void;
    /**
     * Execute a GET query
     * @endpoint url endpoint. Base url should not be included
     */
    get<T>(endpoint: string): AsyncApiResult<T>;
    /**
     * Execute a POST query
     * @endpoint url endpoint. Base url should not be included
     */
    post<T>(endpoint: string, payload: any): AsyncApiResult<T>;
    /**
     * Execute a PUT query
     * @endpoint url endpoint. Base url should not be included
     */
    /**
     * Execute a DELETE query
     * @endpoint url endpoint. Base url should not be included
     */
    private query;
}
