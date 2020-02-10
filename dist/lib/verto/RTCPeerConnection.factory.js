"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RTCPeerConnectionFactory {
    /**
     * We initiate the call
     */
    static outbound(verto, callId, login, phoneNumber) {
        const rtcPeerConnection = new RTCPeerConnection();
        rtcPeerConnection.ontrack = (tr) => {
            const track = tr.track;
            if (track.kind !== 'audio') {
                return;
            }
            const stream = new MediaStream();
            stream.addTrack(track);
            if (!verto.channel) {
                return;
            }
            verto.channel.remoteStream = stream;
            verto.tags.peerTag.srcObject = stream;
        };
        if (!verto.channel) {
            return rtcPeerConnection;
        }
        // Attach our media stream to the call's PeerConnection
        verto.channel.stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track);
        });
        // We wait for candidate to be null to make sure all candidates have been processed
        rtcPeerConnection.onicecandidate = (candidate) => {
            var _a;
            if (!candidate.candidate) {
                verto.send(verto.params.startCall(verto.sessid, callId, login, phoneNumber, (_a = rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp));
            }
        };
        rtcPeerConnection.createOffer().then((offer) => {
            rtcPeerConnection.setLocalDescription(offer).then(() => { });
        });
        return rtcPeerConnection;
    }
    /**
     * We receive the call
     */
    static inbound(verto, callId, login, inboudParams) {
        return new Promise((onRes, onErr) => {
            const rtcPeerConnection = new RTCPeerConnection();
            rtcPeerConnection.ontrack = (tr) => {
                const track = tr.track;
                if (track.kind !== 'audio') {
                    return;
                }
                const stream = new MediaStream();
                stream.addTrack(track);
                if (!verto.channel) {
                    return;
                }
                verto.channel.remoteStream = stream;
                verto.tags.peerTag.srcObject = stream;
            };
            if (!verto.channel) {
                onRes(rtcPeerConnection);
                return;
            }
            // Attach our media stream to the call's PeerConnection
            verto.channel.stream.getTracks().forEach((track) => {
                rtcPeerConnection.addTrack(track);
            });
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: inboudParams.sdp }))
                .then(() => {
                rtcPeerConnection.createAnswer().then(d => {
                    rtcPeerConnection.setLocalDescription(d);
                });
            });
            onRes(rtcPeerConnection);
        });
    }
}
exports.RTCPeerConnectionFactory = RTCPeerConnectionFactory;
//# sourceMappingURL=RTCPeerConnection.factory.js.map