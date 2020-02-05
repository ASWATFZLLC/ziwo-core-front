"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verto_event_1 = require("./verto.event");
/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
class VertoParser {
    static parse(data) {
        if (this.isLoggedIn(data)) {
            return {
                type: verto_event_1.VertoEventType.LoggedIn,
                raw: data,
                payload: data.params,
            };
        }
        if (this.isOutgoingCall(data)) {
            return {
                type: verto_event_1.VertoEventType.OutgoingCall,
                raw: data,
                payload: data.result,
            };
        }
        if (this.isMediaRequest(data)) {
            return {
                type: verto_event_1.VertoEventType.MediaRequest,
                raw: data,
                payload: data.params,
            };
        }
        return {
            type: verto_event_1.VertoEventType.Unknown,
            raw: data,
            payload: data
        };
    }
    static isLoggedIn(data) {
        return data.id === 3;
    }
    static isOutgoingCall(data) {
        return data.id === 4;
    }
    static isMediaRequest(data) {
        return data.method === 'verto.media';
    }
}
exports.VertoParser = VertoParser;
//# sourceMappingURL=verto.parser.js.map