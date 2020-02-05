"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_params_1 = require("./json-rpc.params");
const call_1 = require("./call");
const json_rpc_base_1 = require("./json-rpc.base");
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
class JsonRpcClient extends json_rpc_base_1.JsonRpcBase {
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
            this.sessid = json_rpc_params_1.JsonRpcParams.getUuid();
            this.send(json_rpc_params_1.JsonRpcParams.login(this.sessid, agentPosition.name, agentPosition.password));
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
                this.send(json_rpc_params_1.JsonRpcParams.startCall(this.sessid, call.callId, this.getLogin(), phoneNumber, (_a = call.rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp));
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
        this.send(json_rpc_params_1.JsonRpcParams.hangupCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
}
exports.JsonRpcClient = JsonRpcClient;
//# sourceMappingURL=json-rpc.js.map