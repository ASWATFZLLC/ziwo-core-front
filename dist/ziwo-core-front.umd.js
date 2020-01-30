(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ziwoCoreFront = {}));
}(this, (function (exports) { 'use strict';

  const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
  const MESSAGES = {
      EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`,
      INVALID_PHONE_NUMBER: (phoneNumber) => `${phoneNumber} is not a valid phone number`,
      AGENT_NOT_CONNECTED: (action) => `Agent is not connected. Cannot proceed '${action}'`,
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
              return new Promise((onRes, onErr) => {
                  this.initAgent(api).then(res => onRes(res)).catch(err => onErr(err));
              });
          }
          if (!credentials.email || !credentials.password) {
              throw new Error(MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
          }
          return new Promise((onRes, onErr) => {
              this.loginZiwo(api, credentials.email, credentials.password).then(() => {
                  this.initAgent(api).then(res => onRes(res)).catch(err => onErr(err));
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
      static initAgent(api) {
          return new Promise((onRes, onErr) => {
              Promise.all([
                  this.fetchAgentProfile(api),
                  this.fetchListQueues(api),
                  this.fetchListNumbers(api),
                  this.fetchWebRTCConfig(api),
              ]).then(res => {
                  onRes({
                      userInfo: res[0],
                      queues: res[1] || [],
                      numbers: res[2] || [],
                      webRtc: res[3],
                  });
              })
                  .catch(err => onErr(err));
          });
      }
      static fetchAgentProfile(api) {
          return new Promise((onRes, onErr) => {
              api.get(api.endpoints.profile).then(res => {
                  onRes(res.content);
              }).catch(err => onErr(err));
          });
      }
      static fetchListQueues(api) {
          return new Promise((onRes, onErr) => {
              api.get('/agents/channels/calls/listQueues').then(res => {
                  onRes(res.content);
              }).catch(err => onErr(err));
          });
      }
      static fetchListNumbers(api) {
          return new Promise((onRes, onErr) => {
              api.get('/agents/channels/calls/listNumbers').then(res => {
                  onRes(res.content);
              }).catch(err => onErr(err));
          });
      }
      static fetchWebRTCConfig(api) {
          return new Promise((onRes, onErr) => {
              api.get('/fs/webrtc/config').then(res => {
                  onRes(res.content);
              }).catch(err => onErr(err));
          });
      }
  }
  //# sourceMappingURL=authentication.service.js.map

  class Channel {
      constructor(stream) {
          this.stream = stream;
          this.audioContext = this.getAudioContext();
      }
      startMicrophone() {
          // see https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
          const filterNode = this.audioContext.createBiquadFilter();
          filterNode.type = 'highpass';
          // cutoff frequency: for highpass, audio is attenuated below this frequency
          filterNode.frequency.value = 10000;
          // create a gain node (to change audio volume)
          const gainNode = this.audioContext.createGain();
          // default is 1 (no change); less than 1 means audio is attenuated and vice versa
          gainNode.gain.value = 0.5;
          const source = this.audioContext.createMediaStreamSource(this.stream);
          this.microphone = {
              filterNode,
              gainNode,
              source,
          };
      }
      bindVideo(el) {
          if (!el.srcObject) {
              // TODO : emit appropriate error message
              return;
          }
          el.srcObject = this.stream;
      }
      getAudioContext() {
          let audioContext;
          if (typeof AudioContext === 'function') {
              audioContext = new AudioContext();
          }
          else {
              throw new Error('Web audio not supported');
          }
          return audioContext;
      }
  }
  //# sourceMappingURL=channel.js.map

  class UserMedia {
      static getUserMedia(mediaRequested) {
          return new Promise((onRes, onErr) => {
              try {
                  navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
                      onRes(new Channel(stream));
                  });
              }
              catch (e) {
                  onErr(e);
              }
          });
      }
  }
  //# sourceMappingURL=userMedia.js.map

  const PATTERNS = {
      phoneNumber: /^\+?\d+$/,
  };
  //# sourceMappingURL=regex.js.map

  /**
   * TODO : documentation
   * TODO : define interface for each available type?
   * TODO : define all event type
   */
  var ErrorCode;
  (function (ErrorCode) {
      ErrorCode[ErrorCode["InvalidPhoneNumber"] = 0] = "InvalidPhoneNumber";
      ErrorCode[ErrorCode["UserMediaError"] = 1] = "UserMediaError";
      ErrorCode[ErrorCode["AgentNotConnected"] = 2] = "AgentNotConnected";
  })(ErrorCode || (ErrorCode = {}));
  var ZiwoEventType;
  (function (ZiwoEventType) {
      ZiwoEventType["Error"] = "Error";
      ZiwoEventType["AgentConnected"] = "AgentConnected";
      ZiwoEventType["IncomingCall"] = "IncomingCall";
      ZiwoEventType["OutgoingCall"] = "OutgoingCall";
      ZiwoEventType["CallStarted"] = "CallStarted";
      ZiwoEventType["CallEndedByUser"] = "CallEndedByUser";
      ZiwoEventType["CallEndedByPeer"] = "CallEndedByPeer";
  })(ZiwoEventType || (ZiwoEventType = {}));
  class ZiwoEvent {
      static subscribe(func) {
          this.listeners.push(func);
      }
      static emit(type, data) {
          this.listeners.forEach(x => x(type, data));
      }
  }
  ZiwoEvent.listeners = [];
  //# sourceMappingURL=events.js.map

  var RtcAction;
  (function (RtcAction) {
      RtcAction["StartCall"] = "Start call";
  })(RtcAction || (RtcAction = {}));
  /**
   * RtcClient wraps all interaction with WebRTC
   */
  class RtcClient {
      constructor(video) {
          if (video) {
              this.videoInfo = video;
          }
      }
      /**
       * Connect an agent using its Info
       */
      connectAgent(agent) {
          console.log('Init RTC with > ', agent);
          this.connectedAgent = agent;
          UserMedia.getUserMedia({ audio: true, video: this.videoInfo ? true : false })
              .then(c => {
              this.channel = c;
              window.setTimeout(() => {
                  ZiwoEvent.emit(ZiwoEventType.AgentConnected);
              }, 100);
          }).catch(e => {
              ZiwoEvent.emit(ZiwoEventType.Error, {
                  code: ErrorCode.UserMediaError,
                  message: e,
              });
          });
      }
      /**
       * Get connected Agent returns the Info of the current agent
       */
      getConnectedAgent() {
          return this.connectedAgent;
      }
      /**
       * Return true if an agent is connected
       */
      isAgentConnected() {
          return !!this.connectedAgent && !!this.channel;
      }
      startCall(phoneNumber) {
          var _a;
          if (!this.isAgentConnected() || !this.channel) {
              this.sendNotConnectedEvent('start call');
              return;
          }
          if (!PATTERNS.phoneNumber.test(phoneNumber)) {
              return ZiwoEvent.emit(ZiwoEventType.Error, {
                  code: ErrorCode.InvalidPhoneNumber,
                  message: MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
                  data: {
                      phoneNumber: phoneNumber,
                  }
              });
          }
          (_a = this.channel) === null || _a === void 0 ? void 0 : _a.startMicrophone();
          if (this.videoInfo && this.videoInfo.selfTag) {
              this.channel.bindVideo(this.videoInfo.selfTag);
          }
      }
      sendNotConnectedEvent(action) {
          return ZiwoEvent.emit(ZiwoEventType.Error, {
              code: ErrorCode.InvalidPhoneNumber,
              message: MESSAGES.AGENT_NOT_CONNECTED(action),
          });
      }
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
  //# sourceMappingURL=api.service.js.map

  class ZiwoClient {
      constructor(options) {
          this.options = options;
          this.apiService = new ApiService(options.contactCenterName);
          this.rtcClient = new RtcClient(options.video);
          if (options.autoConnect) {
              this.connect().then(r => {
              }).catch(err => { throw err; });
          }
      }
      connect() {
          return new Promise((onRes, onErr) => {
              AuthenticationService.authenticate(this.apiService, this.options.credentials)
                  .then(res => {
                  this.rtcClient.connectAgent(res);
                  onRes(res);
              }).catch(err => onErr(err));
          });
      }
      addListener(func) {
          return ZiwoEvent.subscribe(func);
      }
      startCall(phoneNumber) {
          this.rtcClient.startCall(phoneNumber);
      }
  }

  exports.ZiwoClient = ZiwoClient;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ziwo-core-front.umd.js.map
