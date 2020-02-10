"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertoMethod;
(function (VertoMethod) {
    VertoMethod["Login"] = "login";
    VertoMethod["ClientReady"] = "verto.clientReady";
    VertoMethod["Media"] = "verto.media";
    VertoMethod["Invite"] = "verto.invite";
    VertoMethod["Answer"] = "verto.answer";
    VertoMethod["Modify"] = "verto.modify";
    VertoMethod["Display"] = "verto.display";
    VertoMethod["Bye"] = "verto.bye";
})(VertoMethod = exports.VertoMethod || (exports.VertoMethod = {}));
var VertoAction;
(function (VertoAction) {
    VertoAction["Hold"] = "hold";
    VertoAction["Unhold"] = "unhold";
})(VertoAction = exports.VertoAction || (exports.VertoAction = {}));
var VertoNotificationMessage;
(function (VertoNotificationMessage) {
    VertoNotificationMessage["CallCreated"] = "CALL CREATED";
    VertoNotificationMessage["CallEnded"] = "CALL ENDED";
})(VertoNotificationMessage = exports.VertoNotificationMessage || (exports.VertoNotificationMessage = {}));
class VertoParams {
    constructor() {
        this.id = 0;
    }
    wrap(method, params = {}, id = -1) {
        this.id += 1;
        return {
            jsonrpc: '2.0',
            method: method,
            id: id > 0 ? id : this.id,
            params: params,
        };
    }
    login(sessid, login, passwd) {
        return this.wrap(VertoMethod.Login, {
            sessid,
            login,
            passwd
        });
    }
    startCall(sessionId, callId, login, phoneNumber, sdp) {
        return this.wrap(VertoMethod.Invite, {
            sdp: sdp,
            sessid: sessionId,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    hangupCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.Bye, {
            cause: 'NORMAL_CLEARING',
            causeCode: 16,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    holdCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.Modify, {
            action: 'hold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    unholdCall(sessionId, callId, login, phoneNumber) {
        return this.wrap(VertoMethod.Modify, {
            action: 'unhold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    answerCall(sessionId, callId, login, phoneNumber, sdp) {
        return this.wrap(VertoMethod.Answer, {
            sdp: sdp,
            sessid: sessionId,
            dialogParams: this.dialogParams(callId, login, phoneNumber, 'Inbound Call')
        });
    }
    getUuid() {
        /* tslint:disable */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            /* tslint:enable */
        });
    }
    dialogParams(callId, login, phoneNumber, callName = 'Outbound Call') {
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