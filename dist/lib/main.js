"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_service_1 = require("./authentication.service");
const rtc_client_1 = require("./rtc/rtc-client");
const api_service_1 = require("./api.service");
const events_1 = require("./events");
class ZiwoClient {
    constructor(options) {
        this.options = options;
        this.apiService = new api_service_1.ApiService(options.contactCenterName);
        this.rtcClient = new rtc_client_1.RtcClient(options.tags, options.debug);
        if (options.autoConnect) {
            this.connect().then(r => {
            }).catch(err => { throw err; });
        }
    }
    connect() {
        return new Promise((onRes, onErr) => {
            authentication_service_1.AuthenticationService.authenticate(this.apiService, this.options.credentials)
                .then(res => {
                this.rtcClient.connectAgent(res);
                onRes(res);
            }).catch(err => onErr(err));
        });
    }
    addListener(func) {
        return events_1.ZiwoEvent.subscribe(func);
    }
    startCall(phoneNumber) {
        return this.rtcClient.startCall(phoneNumber);
    }
}
exports.ZiwoClient = ZiwoClient;
//# sourceMappingURL=main.js.map