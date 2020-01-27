(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('whatwg-fetch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'whatwg-fetch'], factory) :
  (global = global || self, factory(global.ziwoCoreFront = {}, global.whatwgFetch));
}(this, (function (exports, whatwgFetch) { 'use strict';

  whatwgFetch = whatwgFetch && whatwgFetch.hasOwnProperty('default') ? whatwgFetch['default'] : whatwgFetch;

  const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
  const MESSAGES = {
      EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`
  };

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

  var node =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId])
  /******/ 			return installedModules[moduleId].exports;
  /******/
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			exports: {},
  /******/ 			id: moduleId,
  /******/ 			loaded: false
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.loaded = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  	/* WEBPACK VAR INJECTION */(function(global) {	
  	var attach = __webpack_require__(1);
  	
  	module.exports = attach(global);
  	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())));

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  	
  	/*
  	* Configuration for React-Native's package system
  	* @providesModule whatwg-fetch
  	*/
  	
  	var interceptors = [];
  	
  	function interceptor(fetch) {
  	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
  	    args[_key - 1] = arguments[_key];
  	  }
  	
  	  var reversedInterceptors = interceptors.reduce(function (array, interceptor) {
  	    return [interceptor].concat(array);
  	  }, []);
  	  var promise = Promise.resolve(args);
  	
  	  // Register request interceptors
  	  reversedInterceptors.forEach(function (_ref) {
  	    var request = _ref.request,
  	        requestError = _ref.requestError;
  	
  	    if (request || requestError) {
  	      promise = promise.then(function (args) {
  	        return request.apply(undefined, _toConsumableArray(args));
  	      }, requestError);
  	    }
  	  });
  	
  	  // Register fetch call
  	  promise = promise.then(function (args) {
  	    return fetch.apply(undefined, _toConsumableArray(args));
  	  });
  	
  	  // Register response interceptors
  	  reversedInterceptors.forEach(function (_ref2) {
  	    var response = _ref2.response,
  	        responseError = _ref2.responseError;
  	
  	    if (response || responseError) {
  	      promise = promise.then(response, responseError);
  	    }
  	  });
  	
  	  return promise;
  	}
  	
  	module.exports = function attach(env) {
  	  // Make sure fetch is avaibale in the given environment
  	  if (!env.fetch) {
  	    try {
  	      __webpack_require__(2);
  	    } catch (err) {
  	      throw Error('No fetch avaibale. Unable to register fetch-intercept');
  	    }
  	  }
  	  env.fetch = function (fetch) {
  	    return function () {
  	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  	        args[_key2] = arguments[_key2];
  	      }
  	
  	      return interceptor.apply(undefined, [fetch].concat(args));
  	    };
  	  }(env.fetch);
  	
  	  return {
  	    register: function register(interceptor) {
  	      interceptors.push(interceptor);
  	      return function () {
  	        var index = interceptors.indexOf(interceptor);
  	        if (index >= 0) {
  	          interceptors.splice(index, 1);
  	        }
  	      };
  	    },
  	    clear: function clear() {
  	      interceptors = [];
  	    }
  	  };
  	};

  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  	module.exports = whatwgFetch;

  /***/ })
  /******/ ]);

  var fetchIntercept = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': node,
    __moduleExports: node
  });

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
          undefined({
              request: (url, config) => {
                  if (config.headers['Authorization']) {
                      config.headers['Authorization'] = `Bearer ${this.token}`;
                  }
                  else {
                      config.headers = Object.assign({ 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' }, config.headers);
                  }
                  return [url, config];
              }
          });
      }
      /**
       * Execute a GET query
       * @endpoint url endpoint. Base url should not be included
       */
      get(endpoint) {
          // return ky.default.get(`${this.baseUrl}${endpoint}`, this.getKyOptions()).json<ApiResult<T>>();
          return this.query(endpoint, 'GET');
      }
      /**
       * Execute a POST query
       * @endpoint url endpoint. Base url should not be included
       */
      post(endpoint, payload) {
          // return ky.default.post(`${this.baseUrl}${endpoint}`, this.getKyOptions(payload)).json<ApiResult<T>>();
          return this.query(endpoint, 'POST', payload);
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
