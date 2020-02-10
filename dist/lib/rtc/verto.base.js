"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const verto_parser_1 = require("./verto.parser");
class VertoBase {
    constructor(debug) {
        /**
         * Callback functions - register using `addListener`
         */
        this.listeners = [];
        this.debug = debug || false;
    }
    /**
     * addListener allows to listen for incoming Socket Event
     */
    addListener(call) {
        this.listeners.push(call);
    }
    /**
     * openSocket should be called directly after the constructor
     * It initializate the socket and set the handlers
     */
    openSocket(socketUrl) {
        return new Promise((onRes, onErr) => {
            this.socket = new WebSocket(socketUrl);
            this.socket.onclose = () => {
                if (this.debug) {
                    console.warn('Socket closed');
                }
            };
            this.socket.onopen = () => {
                onRes();
            };
            this.socket.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (!this.isJsonRpcValid) {
                        throw new Error('Invalid Incoming JSON RPC');
                    }
                    this.listeners.forEach(fn => fn(verto_parser_1.VertoParser.parse(data)));
                }
                catch (err) {
                    console.warn('Invalid Message', msg);
                    // NOTE : not sure if we should throw an error here -- need live testing to enable/disable
                    events_1.ZiwoEvent.emit(events_1.ZiwoEventType.Error, {
                        code: events_1.ErrorCode.ProtocolError,
                        message: err,
                    });
                }
            };
        });
    }
    /**
     * Send data to socket and log in case of debug
     */
    send(data) {
        if (this.debug) {
            console.log('Write message > ', data);
        }
        if (!this.socket) {
            return;
        }
        this.socket.send(JSON.stringify(data));
    }
    /**
     * Concat position to return the login used in Json RTC request
     */
    getLogin() {
        var _a, _b;
        return `${(_a = this.position) === null || _a === void 0 ? void 0 : _a.name}@${(_b = this.position) === null || _b === void 0 ? void 0 : _b.hostname}`;
    }
    /**
     * Validate the JSON RPC headersx
     */
    isJsonRpcValid(data) {
        return typeof data === 'object'
            && 'jsonrpc' in data
            && data.jsonrpc === '2.0';
    }
}
exports.VertoBase = VertoBase;
//# sourceMappingURL=verto.base.js.map