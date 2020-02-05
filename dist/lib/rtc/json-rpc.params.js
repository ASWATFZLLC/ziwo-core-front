"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonRpcMethod;
(function (JsonRpcMethod) {
    JsonRpcMethod["login"] = "login";
    JsonRpcMethod["invite"] = "verto.invite";
    JsonRpcMethod["modify"] = "verto.modify";
    JsonRpcMethod["bye"] = "verto.bye";
})(JsonRpcMethod = exports.JsonRpcMethod || (exports.JsonRpcMethod = {}));
var JsonRpcActionId;
(function (JsonRpcActionId) {
    JsonRpcActionId[JsonRpcActionId["login"] = 3] = "login";
    JsonRpcActionId[JsonRpcActionId["invite"] = 4] = "invite";
})(JsonRpcActionId = exports.JsonRpcActionId || (exports.JsonRpcActionId = {}));
class JsonRpcParams {
    static wrap(method, id = 0, params = {}) {
        return {
            jsonrpc: '2.0',
            method: method,
            id: id,
            params: params,
        };
    }
    static login(sessid, login, passwd) {
        return this.wrap(JsonRpcMethod.login, 3, {
            sessid,
            login,
            passwd
        });
    }
    static startCall(sessionId, callId, login, phoneNumber, sdp) {
        return this.wrap(JsonRpcMethod.invite, 4, {
            sdp: sdp,
            sessid: sessionId,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static hangupCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.bye, 9, {
            cause: 'NORMAL_CLEARING',
            causeCode: 16,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static holdCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.modify, 11, {
            action: 'hold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static unholdCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.modify, 10, {
            action: 'unhold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
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
exports.JsonRpcParams = JsonRpcParams;
//# sourceMappingURL=json-rpc.params.js.map