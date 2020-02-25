"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertoMethod;
(function (VertoMethod) {
    VertoMethod["Login"] = "login";
    VertoMethod["ClientReady"] = "verto.clientReady";
    VertoMethod["Media"] = "verto.media";
    VertoMethod["Invite"] = "verto.invite";
    VertoMethod["Answer"] = "verto.answer";
    VertoMethod["Info"] = "verto.info";
    VertoMethod["Modify"] = "verto.modify";
    VertoMethod["Display"] = "verto.display";
    VertoMethod["Bye"] = "verto.bye";
})(VertoMethod = exports.VertoMethod || (exports.VertoMethod = {}));
var VertoByeReason;
(function (VertoByeReason) {
    VertoByeReason[VertoByeReason["NORMAL_CLEARING"] = 16] = "NORMAL_CLEARING";
    VertoByeReason[VertoByeReason["CALL_REJECTED"] = 21] = "CALL_REJECTED";
    VertoByeReason[VertoByeReason["ORIGINATOR_CANCEL"] = 487] = "ORIGINATOR_CANCEL";
})(VertoByeReason = exports.VertoByeReason || (exports.VertoByeReason = {}));
var VertoState;
(function (VertoState) {
    VertoState["Hold"] = "hold";
    VertoState["Unhold"] = "unhold";
    VertoState["Destroy"] = "destroy";
    VertoState["Purge"] = "purge";
})(VertoState = exports.VertoState || (exports.VertoState = {}));
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
    hangupCall(sessionId, callId, login, phoneNumber, reason = VertoByeReason.NORMAL_CLEARING) {
        return this.wrap(VertoMethod.Bye, {
            cause: VertoByeReason[reason],
            causeCode: reason,
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
    setState(sessionId, callId, login, phoneNumber, state) {
        return this.wrap(VertoMethod.Modify, {
            action: state,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
            sessid: sessionId,
        });
    }
    dtfm(sessionId, callId, login, char) {
        return this.wrap(VertoMethod.Info, {
            sessid: sessionId,
            dialogParams: {
                callID: callId,
                login: login,
                dtfm: char,
            }
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