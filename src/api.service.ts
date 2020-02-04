
export interface ApiResult<T> {
  result:boolean;
  info:any;
  content:T;
}

export interface AsyncApiResult<T> extends Promise<ApiResult<T>> {}

/**
 * ApiService provide functions for GET, POST, PUT and DELETE query
 *
 * Usage:
 *
 *  const apiService = new ApiService('kalvad-poc'); // contact center name you want to connect to
 *  apiService.get<User>(apiService.endpoints.authenticate) ; // ApiService already defined the endpoints available on Ziwo API
 *    .then( (e) => console.log('User > ', e.data)); // Request object is available under `data`;
 */
export class ApiService {

  public readonly endpoints:any;

  private token?:string;
  private readonly baseUrl:string;
  private readonly contactCenterName:string;
  private readonly API_PROTOCOL = 'https://';
  private readonly API_PREFIX = '-api.aswat.co';

  constructor(contactCenterName:string) {
    this.contactCenterName = contactCenterName;
    this.baseUrl = `${this.API_PROTOCOL}${contactCenterName}${this.API_PREFIX}`;
    this.endpoints = {
      authenticate: `/auth/login`,
      profile: '/profile',
      autologin: '/agents/autoLogin',
    };
  }

  /**
   * Return the hostname of current user
   */
  public getHostname():string {
    return `${this.contactCenterName}${this.API_PREFIX}`;
  }

  /**
   * Set Authorization token for further requests
   */
  public setToken(token:string):void {
    this.token = token;
  }

  /**
   * Execute a GET query
   * @endpoint url endpoint. Base url should not be included
   */
  public get<T>(endpoint:string):AsyncApiResult<T> {
    return this.query<T>(endpoint, 'GET');
  }

  /**
   * Execute a POST query
   * @endpoint url endpoint. Base url should not be included
   */
  public post<T>(endpoint:string, payload:any):AsyncApiResult<T> {
    return this.query<T>(endpoint, 'POST', payload);
  }

  /**
   * Execute a PUT query
   * @endpoint url endpoint. Base url should not be included
   */
  public put<T>(endpoint:string, payload:any):AsyncApiResult<T> {
    return this.query<T>(endpoint, 'PUT', payload);
  }

  /**
   * Execute a DELETE query
   * @endpoint url endpoint. Base url should not be included
   */
  public delete<T>(endpoint:string):AsyncApiResult<T> {
    return this.query<T>(endpoint, 'DELETE');
  }

  private query<T>(endpoint:string, method:'GET'|'POST'|'PUT'|'DELETE', payload?:any):Promise<ApiResult<T>> {
    return new Promise<ApiResult<T>>((onRes, onErr) => {
      const fetchOptions:any = {
        method: method,
      };
      if (payload) {
        fetchOptions.body = JSON.stringify(payload);
      }
      window.fetch(`${this.baseUrl}${endpoint}`, {
        method: method,
        body: payload ? JSON.stringify(payload) : undefined,
        headers: {
          'Content-Type': 'application/json',
          'access_token': `${this.token}`,
        }
      }).then(res => {
        if (!res.ok) {
          onErr(`Fetch error: ${res.statusText}`);
          return;
        }
        onRes(res.json());
      }).catch(err => onErr(err));
    });
  }

}
