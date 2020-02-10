"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertoMethod;
(function (VertoMethod) {
    VertoMethod["login"] = "login";
    VertoMethod["invite"] = "verto.invite";
    VertoMethod["modify"] = "verto.modify";
    VertoMethod["bye"] = "verto.bye";
})(VertoMethod = exports.VertoMethod || (exports.VertoMethod = {}));
class VertoParams {
    static wrap(method, id = 0, params = {}) {
        return {
            jsonrpc: '2.0',
            method: method,
            id: id,
            params: params,
        };
    }
    static login(sessid, login, passwd) {
        return this.wrap(VertoMethod.login, 3, {
            sessid,
            login,
            passwd
        });
    }
    static startCall(sessionId, callId, login, phoneNumber, sdp) {
        return this.wrap(VertoMethod.invite, 4, {
            sdp: sdp,
            sessid: sessionId,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static hangupCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.bye, 9, {
            cause: 'NORMAL_CLEARING',
            causeCode: 16,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    static holdCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.modify, 11, {
            action: 'hold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    static unholdCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.modify, 10, {
            action: 'unhold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    static getUuid() {
        /* tslint:disable */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            /* tslint:enable */
        });
    }
    static dialogParams(callId, login, phoneNumber) {
        return {
            callID: callId,
            caller_id_name: '',
            caller_id_number: '',
            dedEnc: false,
            destination_number: phoneNumber,
            incomingBandwidth: 'default',
            localTag: null,
            login: login,
            outgoingBandwidth: 'default',
            remote_caller_id_name: 'Outbound Call',
            remote_caller_id_number: phoneNumber,
            screenShare: false,
            tag: this.getUuid(),
            useCamera: false,
            useMic: true,
            useSpeak: true,
            useStereo: true,
            useVideo: undefined,
            videoParams: {},
            audioParams: {
                googAutoGainControl: false,
                googNoiseSuppression: false,
                googHighpassFilter: false
            },
        };
    }
}
exports.VertoParams = VertoParams;
//# sourceMappingURL=verto.params.js.map