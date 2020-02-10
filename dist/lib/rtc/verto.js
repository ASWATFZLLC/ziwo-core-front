"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const call_1 = require("./call");
const verto_base_1 = require("./verto.base");
const verto_params_1 = require("./verto.params");
var ZiwoSocketEvent;
(function (ZiwoSocketEvent) {
    ZiwoSocketEvent["LoggedIn"] = "LoggedIn";
    ZiwoSocketEvent["CallCreated"] = "CallCreated";
})(ZiwoSocketEvent = exports.ZiwoSocketEvent || (exports.ZiwoSocketEvent = {}));
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
class Verto extends verto_base_1.VertoBase {
    constructor(debug) {
        super(debug);
        this.ICE_SERVER = 'stun:stun.l.google.com:19302';
    }
    /**
     * Following functions send a request to the opened socket. They do not return the result of the request
     * Instead, you should use `addListener` and use the Socket events to follow the status of the request.
     */
    /**
     * login log the agent in the newly created socket
     */
    login(agentPosition) {
        this.position = agentPosition;
        return new Promise((onRes, onErr) => {
            if (!this.socket) {
                return onErr();
            }
            this.sessid = verto_params_1.VertoParams.getUuid();
            this.send(verto_params_1.VertoParams.login(this.sessid, agentPosition.name, agentPosition.password));
        });
    }
    /**
     * send a start call request
     */
    startCall(phoneNumber, callId, channel, tags) {
        if (!channel.stream) {
            throw new Error('Error in User Media');
        }
        // Create Call and its PeerConnection
        const call = new call_1.Call(callId, this, new RTCPeerConnection({
            iceServers: [{ urls: this.ICE_SERVER }],
        }), channel, phoneNumber);
        call.rtcPeerConnection.ontrack = (tr) => {
            const track = tr.track;
            if (track.kind !== 'audio') {
                return;
            }
            const stream = new MediaStream();
            stream.addTrack(track);
            channel.remoteStream = stream;
            tags.peerTag.srcObject = stream;
        };
        // Attach our media stream to the call's PeerConnection
        channel.stream.getTracks().forEach((track) => {
            call.rtcPeerConnection.addTrack(track);
        });
        // We wait for candidate to be null to make sure all candidates have been processed
        call.rtcPeerConnection.onicecandidate = (candidate) => {
            var _a;
            if (!candidate.candidate) {
                this.send(verto_params_1.VertoParams.startCall(this.sessid, call.callId, this.getLogin(), phoneNumber, (_a = call.rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp));
            }
        };
        call.rtcPeerConnection.createOffer().then(offer => {
            call.rtcPeerConnection.setLocalDescription(offer).then(() => { });
        });
        return call;
    }
    /**
     * Hang up a specific call
     */
    hangupCall(callId, phoneNumber) {
        this.send(verto_params_1.VertoParams.hangupCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hold a specific call
     */
    holdCall(callId, phoneNumber) {
        this.send(verto_params_1.VertoParams.holdCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hang up a specific call
     */
    unholdCall(callId, phoneNumber) {
        this.send(verto_params_1.VertoParams.unholdCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
}
exports.Verto = Verto;
//# sourceMappingURL=verto.js.map