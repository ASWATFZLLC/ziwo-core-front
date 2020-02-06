"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(callId, jsonRpcClient, rtcPeerConnection, channel, phoneNumber) {
        this.status = {
            call: CallStatus.Running,
            microphone: CallStatus.Running,
            camera: CallStatus.Stopped,
        };
        this.jsonRpcClient = jsonRpcClient;
        this.callId = callId;
        this.rtcPeerConnection = rtcPeerConnection;
        this.channel = channel;
        this.phoneNumber = phoneNumber;
    }
    getCallStatus() {
        return this.status;
    }
    answer() {
        console.warn('Answer not implemented');
    }
    hangup() {
        this.jsonRpcClient.hangupCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Stopped;
    }
    hold() {
        this.jsonRpcClient.holdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.OnHold;
    }
    unhold() {
        this.jsonRpcClient.unholdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Running;
    }
    mute() {
        this.toggleSelfStream(true);
        this.status.microphone = CallStatus.OnHold;
    }
    unmute() {
        this.toggleSelfStream(false);
        this.status.microphone = CallStatus.Running;
    }
    toggleSelfStream(enabled) {
        this.channel.stream.getAudioTracks().forEach((tr) => {
            tr.enabled = enabled;
        });
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map