(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ziwoCoreFront = {}));
}(this, (function (exports) { 'use strict';

  const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
  const MESSAGES = {
      EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`
  };
  //# sourceMappingURL=messages.js.map

  var UserStatus;
  (function (UserStatus) {
      UserStatus["Active"] = "active";
  })(UserStatus || (UserStatus = {}));
  var UserType;
  (function (UserType) {
      UserType["Admin"] = "admin";
  })(UserType || (UserType = {}));
  var UserProfileType;
  (function (UserProfileType) {
      UserProfileType["User"] = "users";
  })(UserProfileType || (UserProfileType = {}));
  class AuthenticationService {
      constructor() { }
      static authenticate(api, credentials) {
          if (credentials.authenticationToken) {
              api.setToken(credentials.authenticationToken);
              return this.loginCallCenter(api);
          }
          if (!credentials.email || !credentials.password) {
              throw new Error(MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
          }
          return new Promise((onRes, onErr) => {
              this.loginZiwo(api, credentials.email, credentials.password).then(() => {
                  this.loginCallCenter(api).then(res => onRes(res)).catch(err => onErr(err));
              }).catch(err => onErr(err));
          });
      }
      static loginCallCenter(api) {
          return new Promise((onRes, onErr) => {
              api.get(api.endpoints.profile).then(res => {
                  console.log('Agent profile', res);
              }).catch(err => onErr(err));
          });
      }
      static loginZiwo(api, email, password) {
          return new Promise((onRes, onErr) => {
              api.post(api.endpoints.authenticate, {
                  username: email,
                  password: password,
              }).then(r => {
                  api.setToken(r.content.access_token);
                  onRes(r.content);
              }).catch(e => {
                  onErr(e);
              });
          });
      }
  }

  /**
   * RtcClient wraps all interaction with WebRTC
   */
  class RtcClient {
      constuctor() { }
  }
  //# sourceMappingURL=rtc-client.js.map

  /**
   * ApiService wraps the axios to provide quick GET, POST, PUT and DELETE
   *
   * Usage:
   *
   *  const apiService = new ApiService('kalvad-poc'); // contact center name you want to connect to
   *  apiService.get<User>(apiService.endpoints.authenticate) ; // ApiService already defined the endpoints available on Ziwo API
   *    .then( (e) => console.log('User > ', e.data)); // Request object is available under `data`;
   */
  class ApiService {
      constructor(contactCenterName) {
          this.API_PROTOCOL = 'https://';
          this.API_PREFIX = '-api.aswat.co';
          this.baseUrl = `${this.API_PROTOCOL}${contactCenterName}${this.API_PREFIX}`;
          this.endpoints = {
              authenticate: `/auth/login`,
              profile: '/profile',
          };
      }
      /**
       * Set Authorization token for further requests
       */
      setToken(token) {
          this.token = token;
      }
      /**
       * Execute a GET query
       * @endpoint url endpoint. Base url should not be included
       */
      get(endpoint) {
          return this.query(endpoint, 'GET');
      }
      /**
       * Execute a POST query
       * @endpoint url endpoint. Base url should not be included
       */
      post(endpoint, payload) {
          return this.query(endpoint, 'POST', payload);
      }
      /**
       * Execute a PUT query
       * @endpoint url endpoint. Base url should not be included
       */
      put(endpoint, payload) {
          return this.query(endpoint, 'PUT', payload);
      }
      /**
       * Execute a DELETE query
       * @endpoint url endpoint. Base url should not be included
       */
      delete(endpoint) {
          return this.query(endpoint, 'DELETE');
      }
      query(endpoint, method, payload) {
          return new Promise((onRes, onErr) => {
              const fetchOptions = {
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

  class ZiwoClient {
      constructor(options) {
          this.options = options;
          this.apiService = new ApiService(options.contactCenterName);
          this.rtcClient = new RtcClient();
          if (options.autoConnect) {
              this.connect().then().catch(err => { throw err; });
          }
      }
      connect() {
          return AuthenticationService.authenticate(this.apiService, this.options.credentials);
      }
  }

  exports.ZiwoClient = ZiwoClient;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ziwo-core-front.umd.js.map
