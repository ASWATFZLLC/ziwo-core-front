"use strict";
/**
 * TODO : documentation
 * TODO : define interface for each available type?
 * TODO : define all event type
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["InvalidPhoneNumber"] = 2] = "InvalidPhoneNumber";
    ErrorCode[ErrorCode["UserMediaError"] = 3] = "UserMediaError";
    ErrorCode[ErrorCode["AgentNotConnected"] = 1] = "AgentNotConnected";
    ErrorCode[ErrorCode["ProtocolError"] = 4] = "ProtocolError";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var ZiwoEventType;
(function (ZiwoEventType) {
    ZiwoEventType["Error"] = "Error";
    ZiwoEventType["AgentConnected"] = "AgentConnected";
    ZiwoEventType["IncomingCall"] = "IncomingCall";
    ZiwoEventType["OutgoingCall"] = "OutgoingCall";
    ZiwoEventType["CallStarted"] = "CallStarted";
    ZiwoEventType["CallEndedByUser"] = "CallEndedByUser";
    ZiwoEventType["CallEndedByPeer"] = "CallEndedByPeer";
})(ZiwoEventType = exports.ZiwoEventType || (exports.ZiwoEventType = {}));
class ZiwoEvent {
    static subscribe(func) {
        this.listeners.push(func);
    }
    static emit(type, data) {
        this.listeners.forEach(x => x(type, data));
    }
}
exports.ZiwoEvent = ZiwoEvent;
ZiwoEvent.listeners = [];
//# sourceMappingURL=events.js.map