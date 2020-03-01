"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TODO : documentation
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["InvalidPhoneNumber"] = 2] = "InvalidPhoneNumber";
    ErrorCode[ErrorCode["UserMediaError"] = 3] = "UserMediaError";
    ErrorCode[ErrorCode["AgentNotConnected"] = 1] = "AgentNotConnected";
    ErrorCode[ErrorCode["ProtocolError"] = 4] = "ProtocolError";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var ZiwoErrorCode;
(function (ZiwoErrorCode) {
    ZiwoErrorCode[ZiwoErrorCode["ProtocolError"] = 1001] = "ProtocolError";
    ZiwoErrorCode[ZiwoErrorCode["MediaError"] = 1002] = "MediaError";
    ZiwoErrorCode[ZiwoErrorCode["MissingCall"] = 1003] = "MissingCall";
    ZiwoErrorCode[ZiwoErrorCode["CannotCreateCall"] = 1004] = "CannotCreateCall";
})(ZiwoErrorCode = exports.ZiwoErrorCode || (exports.ZiwoErrorCode = {}));
var ZiwoEventType;
(function (ZiwoEventType) {
    ZiwoEventType["Error"] = "error";
    ZiwoEventType["Connected"] = "connected";
    ZiwoEventType["Disconnected"] = "disconnected";
    ZiwoEventType["Requesting"] = "requesting";
    ZiwoEventType["Trying"] = "trying";
    ZiwoEventType["Early"] = "early";
    ZiwoEventType["Ringing"] = "ringing";
    ZiwoEventType["Answering"] = "answering";
    ZiwoEventType["Active"] = "active";
    ZiwoEventType["Held"] = "held";
    ZiwoEventType["Hangup"] = "hangup";
    ZiwoEventType["Mute"] = "mute";
    ZiwoEventType["Unmute"] = "unmute";
    ZiwoEventType["Purge"] = "purge";
    ZiwoEventType["Destroy"] = "destroy";
    ZiwoEventType["Recovering"] = "recovering";
})(ZiwoEventType = exports.ZiwoEventType || (exports.ZiwoEventType = {}));
class ZiwoEvent {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    static subscribe(func) {
        this.listeners.push(func);
    }
    static emit(type, data) {
        this.listeners.forEach(x => x(type, data));
        this.dispatchEvents(type, data);
    }
    static error(code, data) {
        this.dispatchEvents(ZiwoEventType.Error, {
            code: code,
            inner: data,
        });
    }
    static dispatchEvents(type, data) {
        this.prefixes.forEach(p => window.dispatchEvent(new CustomEvent(`${p}${type}`, { detail: data })));
    }
    emit() {
        ZiwoEvent.emit(this.type, this.data);
    }
}
exports.ZiwoEvent = ZiwoEvent;
ZiwoEvent.listeners = [];
ZiwoEvent.prefixes = ['_jorel-dialog-state-', 'ziwo-'];
//# sourceMappingURL=events.js.map