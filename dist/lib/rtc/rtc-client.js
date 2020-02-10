"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const media_channel_1 = require("./media-channel");
const rtc_client_handlers_1 = require("./rtc-client.handlers");
const regex_1 = require("../regex");
const messages_1 = require("../messages");
const verto_1 = require("./verto");
const verto_event_1 = require("./verto.event");
const verto_params_1 = require("./verto.params");
/**
 * RtcClient wraps all interaction with WebRTC
 * It holds the validation & all properties required for usage of Web RTC
 */
class RtcClient extends rtc_client_handlers_1.RtcClientHandlers {
    constructor(tags, debug) {
        super(tags, debug);
    }
    /**
     * User Agent Info to authenticate on the socket
     * Also requests access to User Media (audio &| video)
     */
    connectAgent(agent) {
        return new Promise((onRes, onErr) => {
            this.connectedAgent = agent;
            this.verto = new verto_1.Verto(this.debug);
            // First we make ensure access to microphone &| camera
            // And wait for the socket to open
            Promise.all([
                media_channel_1.MediaChannel.getUserMediaAsChannel({ audio: true, video: false }),
                this.verto.openSocket(this.connectedAgent.webRtc.socket),
            ]).then(res => {
                var _a, _b;
                this.channel = res[0];
                (_a = this.verto) === null || _a === void 0 ? void 0 : _a.addListener((ev) => {
                    if (ev.type === verto_event_1.VertoEventType.LoggedIn) {
                        events_1.ZiwoEvent.emit(events_1.ZiwoEventType.AgentConnected);
                        onRes();
                        return;
                    }
                    // This is our global handler for incoming message
                    this.processIncomingSocketMessage(ev);
                });
                (_b = this.verto) === null || _b === void 0 ? void 0 : _b.login(agent.position);
            }).catch(err => {
                onErr(err);
            });
        });
    }
    /**
     * Start a phone call and return a Call or undefined if an error occured
     */
    startCall(phoneNumber) {
        var _a;
        if (!this.isAgentConnected() || !this.channel || !this.verto) {
            this.sendNotConnectedEvent('start call');
            return;
        }
        if (!regex_1.PATTERNS.phoneNumber.test(phoneNumber)) {
            events_1.ZiwoEvent.emit(events_1.ZiwoEventType.Error, {
                code: events_1.ErrorCode.InvalidPhoneNumber,
                message: messages_1.MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
                data: {
                    phoneNumber: phoneNumber,
                }
            });
            return;
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.startMicrophone();
        const call = this.verto.startCall(phoneNumber, verto_params_1.VertoParams.getUuid(), this.channel, this.tags);
        this.calls.push(call);
        return call;
    }
    /**
     * Process message
     */
    processIncomingSocketMessage(ev) {
        if (this.debug) {
            console.log('New incoming message', ev);
        }
        switch (ev.type) {
            case verto_event_1.VertoEventType.OutgoingCall:
                this.outgoingCall(ev.payload);
                break;
            case verto_event_1.VertoEventType.MediaRequest:
                this.acceptMediaRequest(ev.payload);
                break;
        }
    }
}
exports.RtcClient = RtcClient;
//# sourceMappingURL=rtc-client.js.map