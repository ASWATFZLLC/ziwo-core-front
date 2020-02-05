"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Call holds a call information and provide helpers
 */
class Call {
    constructor(callId, jsonRpcClient, rtcPeerConnection, channel, phoneNumber) {
        this.jsonRpcClient = jsonRpcClient;
        this.callId = callId;
        this.rtcPeerConnection = rtcPeerConnection;
        this.channel = channel;
        this.phoneNumber = phoneNumber;
    }
    answer() {
        console.warn('Answer not implemented');
    }
    hangup() {
        console.warn('Hangup not implemented');
        this.jsonRpcClient.hangupCall(this.callId, this.phoneNumber);
    }
    mute() {
        console.warn('Mute not implemented');
    }
    unmute() {
        console.warn('Unmute not implemented');
    }
    hold() {
        console.warn('Hold not implemented');
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map