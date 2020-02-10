"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const media_channel_1 = require("../media-channel");
const call_1 = require("../call");
const verto_params_1 = require("./verto.params");
const verto_orchestrator_1 = require("./verto.orchestrator");
const events_1 = require("../events");
const messages_1 = require("../messages");
const RTCPeerConnection_factory_1 = require("./RTCPeerConnection.factory");
/**
 * JsonRpcClient implements Verto protocol using JSON RPC
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
 *      .then(() => {
 *        this.login() // REQUIRED: log the agent into the web socket
 *        // You can now proceed with any requests
 *      });
 *
 */
class Verto {
    constructor(calls, debug, tags) {
        /**
         * Callback functions - register using `addListener`
         */
        this.listeners = [];
        this.ICE_SERVER = 'stun:stun.l.google.com:19302';
        this.debug = debug;
        this.tags = tags;
        this.orchestrator = new verto_orchestrator_1.VertoOrchestrator(this, this.debug);
        this.params = new verto_params_1.VertoParams();
        this.calls = calls;
    }
    /**
     * addListener allows to listen for incoming Socket Event
     */
    addListener(call) {
        this.listeners.push(call);
    }
    connectAgent(agent) {
        return new Promise((onRes, onErr) => {
            // First we make ensure access to microphone &| camera
            // And wait for the socket to open
            Promise.all([
                media_channel_1.MediaChannel.getUserMediaAsChannel({ audio: true, video: false }),
                this.openSocket(agent.webRtc.socket),
            ]).then(res => {
                this.channel = res[0];
                this.login(agent.position);
            }).catch(err => {
                onErr(err);
            });
        });
    }
    /**
     * send a start call request
     */
    startCall(phoneNumber) {
        if (!this.channel || !this.channel.stream) {
            // TODO : throw Ziwo Error Event
            throw new Error('Error in User Media');
        }
        try {
            const callId = this.params.getUuid();
            const pc = RTCPeerConnection_factory_1.RTCPeerConnectionFactory.outbound(this, callId, this.getLogin(), phoneNumber);
            const call = new call_1.Call(callId, this, phoneNumber, this.getLogin(), pc, 'outbound');
            call.pushState(events_1.ZiwoEventType.Requesting, true);
            call.pushState(events_1.ZiwoEventType.Trying, true);
            return call;
        }
        catch (e) {
            events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.CannotCreateCall, e);
            return undefined;
        }
    }
    /**
     * Answer a call
     */
    answerCall(callId, phoneNumber, sdp) {
        try {
            this.send(this.params.answerCall(this.sessid, callId, this.getLogin(), phoneNumber, sdp));
            const c = this.calls.find(x => x.callId === callId);
            if (c) {
                c.pushState(events_1.ZiwoEventType.Active);
            }
        }
        catch (e) {
            events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.MissingCall, e);
        }
    }
    /**
     * Hang up a specific call
     */
    hangupCall(callId, phoneNumber) {
        this.send(this.params.hangupCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hold a specific call
     */
    holdCall(callId, phoneNumber) {
        this.send(this.params.holdCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hang up a specific call
     */
    unholdCall(callId, phoneNumber) {
        this.send(this.params.unholdCall(this.sessid, callId, this.getLogin(), phoneNumber));
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
     * login log the agent in the newly created socket
     */
    login(agentPosition) {
        this.position = agentPosition;
        return new Promise((onRes, onErr) => {
            if (!this.socket) {
                return onErr();
            }
            this.sessid = this.params.getUuid();
            this.send(this.params.login(this.sessid, agentPosition.name, agentPosition.password));
        });
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
                    console.log('Socket closed');
                }
            };
            this.socket.onopen = () => {
                if (this.debug) {
                    console.log('Socket opened');
                }
                onRes();
            };
            this.socket.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (!this.isJsonRpcValid) {
                        events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.ProtocolError, data);
                        throw new Error('Message is not a valid format');
                    }
                    const callId = data.params && data.params.callID ? data.params.callID :
                        (data.result && data.result.callID ? data.result.callID : undefined);
                    const relatedCall = callId ? this.calls.find(c => c.callId === callId) : undefined;
                    this.orchestrator.onInput(data, relatedCall);
                }
                catch (err) {
                    events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.ProtocolError, err);
                    if (this.debug) {
                        console.warn('Invalid incoming message', err);
                    }
                }
            };
        });
    }
    getNewRTCPeerConnection() {
        const rtcPeerConnection = new RTCPeerConnection({
            iceServers: [{ urls: this.ICE_SERVER }],
        });
        return rtcPeerConnection;
    }
    /**
     * Concat position to return the login used in Json RTC request
     */
    getLogin() {
        var _a, _b;
        return `${(_a = this.position) === null || _a === void 0 ? void 0 : _a.name}@${(_b = this.position) === null || _b === void 0 ? void 0 : _b.hostname}`;
    }
    ensureMediaChannelIsValid() {
        if (!this.channel || !this.channel.stream) {
            events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.MediaError, messages_1.MESSAGES.MEDIA_ERROR);
            return false;
        }
        return true;
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
exports.Verto = Verto;
//# sourceMappingURL=verto.js.map