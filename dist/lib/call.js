"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
var CallStatus;
(function (CallStatus) {
    CallStatus["Stopped"] = "stopped";
    CallStatus["Running"] = "running";
    CallStatus["OnHold"] = "onHold";
})(CallStatus = exports.CallStatus || (exports.CallStatus = {}));
/**
 * Call holds a call information and provide helpers
 */
class Call {
    constructor(callId, verto, phoneNumber, login, rtcPeerConnection, direction, outboundDetails) {
        this.states = [];
        this.status = {
            call: CallStatus.Running,
            microphone: CallStatus.Running,
            camera: CallStatus.Stopped,
        };
        this.verto = verto;
        this.callId = callId;
        this.verto = verto;
        this.rtcPeerConnection = rtcPeerConnection;
        this.channel = verto.channel;
        this.phoneNumber = phoneNumber;
        this.direction = direction;
        this.outboundDetails = outboundDetails;
        if (this.direction === 'inbound') {
            this.primaryCallId = outboundDetails.verto_h_primaryCallID;
        }
    }
    getCallStatus() {
        return this.status;
    }
    answer() {
        var _a;
        return this.verto.answerCall(this.callId, this.phoneNumber, (_a = this.rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp);
    }
    hangup() {
        this.verto.hangupCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Stopped;
    }
    hold() {
        this.verto.holdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.OnHold;
    }
    unhold() {
        this.verto.unholdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Running;
    }
    mute() {
        this.toggleSelfStream(true);
        this.status.microphone = CallStatus.OnHold;
        // Because mute is not sent/received over the socket, we throw the event manually
        this.pushState(events_1.ZiwoEventType.Mute);
    }
    unmute() {
        this.toggleSelfStream(false);
        this.status.microphone = CallStatus.Running;
        this.pushState(events_1.ZiwoEventType.Unmute);
        // Because unmute is not sent/received over the socket, we throw the event manually
    }
    pushState(type, broadcast = true) {
        const d = new Date();
        this.states.push({
            state: type,
            date: d,
            dateUNIX: d.getTime() / 1000
        });
        if (broadcast) {
            events_1.ZiwoEvent.emit(type, {
                type,
                call: this,
            });
        }
    }
    toggleSelfStream(enabled) {
        this.channel.stream.getAudioTracks().forEach((tr) => {
            tr.enabled = enabled;
        });
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map