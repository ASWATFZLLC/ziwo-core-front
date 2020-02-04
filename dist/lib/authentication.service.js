"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5_typescript_1 = require("md5-typescript");
const messages_1 = require("./messages");
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
            throw new Error(messages_1.MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
        }
        return new Promise((onRes, onErr) => {
            this.loginZiwo(api, credentials.email, credentials.password).then(() => {
                Promise.all([
                    this.initAgent(api),
                    this.autoLogin(api),
                ]).then(res => {
                    onRes(res[0]);
                }).catch(err => onErr(err));
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
    static autoLogin(api) {
        return api.put('/agents/autologin', {});
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
                    webRtc: {
                        socket: `${res[3].webSocket.protocol}://${api.getHostname()}:${res[3].webSocket.port}`,
                    },
                    position: {
                        name: `agent-${res[0].ccLogin}`,
                        password: md5_typescript_1.Md5.init(`${res[0].ccLogin}${res[0].ccPassword}`).toString(),
                        hostname: api.getHostname(),
                    }
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
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map