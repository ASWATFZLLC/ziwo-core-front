"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
const verto_params_1 = require("./verto/verto.params");
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
    constructor(callId, verto, phoneNumber, login, rtcPeerConnection, direction, initialPayload) {
        this.states = [];
        this.verto = verto;
        this.callId = callId;
        this.verto = verto;
        this.rtcPeerConnection = rtcPeerConnection;
        this.channel = verto.channel;
        this.phoneNumber = phoneNumber;
        this.direction = direction;
        this.initialPayload = initialPayload;
        if (this.initialPayload && this.initialPayload.verto_h_primaryCallID) {
            this.primaryCallId = this.initialPayload.verto_h_primaryCallID;
        }
    }
    answer() {
        var _a;
        return this.verto.answerCall(this.callId, this.phoneNumber, (_a = this.rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp);
    }
    hangup() {
        this.pushState(events_1.ZiwoEventType.Hangup);
        this.verto.hangupCall(this.callId, this.phoneNumber, this.states.findIndex(x => x.state === events_1.ZiwoEventType.Answering) >= 0 ? verto_params_1.VertoByeReason.NORMAL_CLEARING
            : (this.direction === 'inbound' ? verto_params_1.VertoByeReason.CALL_REJECTED : verto_params_1.VertoByeReason.ORIGINATOR_CANCEL));
    }
    dtfm(char) {
        this.verto.dtfm(this.callId, char);
    }
    hold() {
        this.verto.holdCall(this.callId, this.phoneNumber);
    }
    unhold() {
        this.verto.unholdCall(this.callId, this.phoneNumber);
    }
    mute() {
        this.toggleSelfStream(true);
        // Because mute is not sent/received over the socket, we throw the event manually
        this.pushState(events_1.ZiwoEventType.Mute);
    }
    unmute() {
        this.toggleSelfStream(false);
        this.pushState(events_1.ZiwoEventType.Unmute);
        // Because unmute is not sent/received over the socket, we throw the event manually
    }
    attendedTransfer(destination) {
        this.hold();
        const call = this.verto.startCall(destination);
        if (!call) {
            return undefined;
        }
        this.verto.calls.push(call);
        return call;
    }
    proceedAttendedTransfer(transferCall) {
        if (!transferCall) {
            return;
        }
        const destination = transferCall.phoneNumber;
        transferCall.hangup();
        this.blindTransfer(destination);
    }
    blindTransfer(destination) {
        this.verto.blindTransfer(destination, this.callId, this.phoneNumber);
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
                currentCall: this,
                primaryCallID: this.primaryCallId,
                callID: this.callId,
                direction: this.direction,
                stateFlow: this.states,
                customerNumber: this.phoneNumber,
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