import * as ky from 'ky';
// import * as fetchIntercept from 'fetch-intercept';
import * as fetchInterceptor from 'fetch-interceptor';

export interface ApiResult<T> {
  result:boolean;
  info:any;
  content:T;
}

export interface AsyncApiResult<T> extends Promise<ApiResult<T>> {}

/**
 * ApiService wraps the axios to provide quick GET, POST, PUT and DELETE
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

  private readonly API_PROTOCOL = 'https://';
  private readonly API_PREFIX = '-api.aswat.co';

  constructor(contactCenterName:string) {
    this.baseUrl = `${this.API_PROTOCOL}${contactCenterName}${this.API_PREFIX}`;

    this.endpoints = {
      authenticate: `/auth/login`,
      profile: '/profile',
    };
  }

  /**
   * Set Authorization token for further requests
   */
  public setToken(token:string):void {
    this.token = token;
    fetchInterceptor.register({});
    // fetchIntercept.register({
    //   request: (url, config) => {
    //     if (config.headers['Authorization']) {
    //       config.headers['Authorization'] = `Bearer ${this.token}`;
    //     } else {
    //       config.headers = {
    //         'Authorization': `Bearer ${this.token}`,
    //         'Content-Type': 'application/json',
    //         ...config.headers
    //       };
    //     }
    //     return [url, config];
    //   }
    // });
  }

  /**
   * Execute a GET query
   * @endpoint url endpoint. Base url should not be included
   */
  public get<T>(endpoint:string):AsyncApiResult<T> {
    // return ky.default.get(`${this.baseUrl}${endpoint}`, this.getKyOptions()).json<ApiResult<T>>();
    return this.query<T>(endpoint, 'GET');
  }

  /**
   * Execute a POST query
   * @endpoint url endpoint. Base url should not be included
   */
  public post<T>(endpoint:string, payload:any):AsyncApiResult<T> {
    // return ky.default.post(`${this.baseUrl}${endpoint}`, this.getKyOptions(payload)).json<ApiResult<T>>();
    return this.query<T>(endpoint, 'POST', payload);
  }

  /**
   * Execute a PUT query
   * @endpoint url endpoint. Base url should not be included
   */
  // public put<T>(endpoint:string, payload:any):AsyncApiResult<T> {
  //   return ky.default.put(`${this.baseUrl}${endpoint}`, this.getKyOptions(payload)).json<ApiResult<T>>();
  // }

  /**
   * Execute a DELETE query
   * @endpoint url endpoint. Base url should not be included
   */
  // public delete<T>(endpoint:string):AsyncApiResult<T> {
  //   return ky.default.delete(`${this.baseUrl}${endpoint}`, this.getKyOptions()).json<ApiResult<T>>();
  // }

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
      }).then(res => {
        if (!res.ok) {
          onErr(`Fetch error: ${res.statusText}`);
          return;
        }
        onRes(res.json());
      }).catch(err => onErr(err));
    });
  }

  // private getKyOptions(payload?:any):ky.Options {
  //   const opt:ky.Options = {
  //     headers: this.getHttpHeaders()
  //   };
  //   if (payload) {
  //     opt.json = payload;
  //   }
  //   console.log(opt);
  //   return opt;
  // }

  // private getHttpHeaders():any {
  //   if (this.token) {
  //     return {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${this.token}`
  //     };
  //   }
  //   return {
  //     'content-type': 'application/json'
  //   };
  // }

}
