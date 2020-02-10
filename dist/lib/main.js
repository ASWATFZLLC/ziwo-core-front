"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_service_1 = require("./authentication.service");
const api_service_1 = require("./api.service");
const events_1 = require("./events");
const verto_1 = require("./verto/verto");
class ZiwoClient {
    constructor(options) {
        this.calls = [];
        this.options = options;
        this.debug = options.debug || false;
        this.apiService = new api_service_1.ApiService(options.contactCenterName);
        this.verto = new verto_1.Verto(this.calls, this.debug, options.tags);
        if (options.autoConnect) {
            this.connect().then(r => {
            }).catch(err => { throw err; });
        }
    }
    /**
     * connect authenticate the user over Ziwo & our communication socket
     * This function is required before proceeding with calls
     */
    connect() {
        return new Promise((onRes, onErr) => {
            authentication_service_1.AuthenticationService.authenticate(this.apiService, this.options.credentials)
                .then(res => {
                this.connectedAgent = res;
                this.verto.connectAgent(this.connectedAgent);
                onRes();
            }).catch(err => onErr(err));
        });
    }
    addListener(func) {
        return events_1.ZiwoEvent.subscribe(func);
    }
    startCall(phoneNumber) {
        const call = this.verto.startCall(phoneNumber);
        if (!call) {
            return undefined;
        }
        this.calls.push(call);
        return call;
    }
}
exports.ZiwoClient = ZiwoClient;
//# sourceMappingURL=main.js.map