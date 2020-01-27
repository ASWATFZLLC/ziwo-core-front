import {RestClient, IRestResponse} from 'typed-rest-client/RestClient';

export interface ApiEndpoint {
  authenticate:string;
}

interface HttpHeaders {
  contentType:'application/javascript';
  Authorization?:string;
}

/**
 * ApiService wraps the typed-rest-client to provide quick GET, POST, PUT and DELETE
 * Documentation: https://github.com/microsoft/typed-rest-client
 *
 * Usage:
 *
 *  const apiService = new ApiService('kalvad-poc'); // contact center name you want to connect to
 *  apiService.get(apiService.endpoints.authenticate) ; // ApiService already defined the endpoint available on Ziwo API
 *    .then( ... ).catch( ... );
 */
export class ApiService {

  public readonly endpoints:ApiEndpoint;

  private token?:string;
  private readonly url:string;
  private readonly httpClient:RestClient;

  private readonly API_PROTOCOL = 'https://';
  private readonly API_PREFIX = '-api.aswat.co';
  private readonly HTTP_USER_AGENT = 'vsts-node-api'; // see typed-rest-client documentation

  constructor(contactCenterName:string) {
    this.url = `${this.API_PROTOCOL}${contactCenterName}${this.API_PREFIX}`;
    this.httpClient = new RestClient(this.HTTP_USER_AGENT, this.url);

    this.endpoints = {
      authenticate: `/auth/login`
    };
  }

  /**
   * Set Authorization token for further requests
   */
  public setToken(token:string):void {
    this.token = token;
  }

  public get<T>(endpoint:string):Promise<IRestResponse<T>> {
    return this.httpClient.get<T>(endpoint, this.getHttpHeaders());
    // return this.httpClient.execute<T>(new httpclient.Request(`${endpoint}`, {
      // contentType: 'application/javascript'}
    // ));
  }

  public post<T>(endpoint:string, payload:any):Promise<IRestResponse<T>> {
    return this.httpClient.create<T>(endpoint, payload, this.getHttpHeaders())
  }

  private getHttpHeaders():any {
    const headers:HttpHeaders = {
      contentType: 'application/javascript',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return {
      additionalHeaders: headers
    };
  }

}
