"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_client_base_1 = require("./rtc-client.base");
class RtcClientHandlers extends rtc_client_base_1.RtcClientBase {
    constructor(tags, debug) {
        super(tags, debug);
    }
    outgoingCall(data) {
        if (this.currentCall) {
            return console.warn('Outgoing Call - but there is already a call in progress');
        }
    }
    acceptMediaRequest(data) {
        const call = this.calls.find(x => x.callId === data.callID);
        if (!call) {
            return; // invalid call id?
        }
        call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }))
            .then(() => console.log('Remote media connected'))
            .catch(() => console.warn('fail to attach remote media'));
        // call.answer();
    }
}
exports.RtcClientHandlers = RtcClientHandlers;
//# sourceMappingURL=rtc-client.handlers.js.map