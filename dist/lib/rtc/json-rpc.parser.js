"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_interfaces_1 = require("./json-rpc.interfaces");
const json_rpc_params_1 = require("./json-rpc.params");
/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
class JsonRpcParser {
    static parse(data) {
        if (this.isLoggedIn(data)) {
            return {
                type: json_rpc_interfaces_1.JsonRpcEventType.LoggedIn,
                raw: data,
                payload: data.params,
            };
        }
        if (this.isOutgoingCall(data)) {
            return {
                type: json_rpc_interfaces_1.JsonRpcEventType.OutgoingCall,
                raw: data,
                payload: data.result,
            };
        }
        if (this.isMediaRequest(data)) {
            return {
                type: json_rpc_interfaces_1.JsonRpcEventType.MediaRequest,
                raw: data,
                payload: data.params,
            };
        }
        return {
            type: json_rpc_interfaces_1.JsonRpcEventType.Unknown,
            raw: data,
            payload: data
        };
    }
    static isLoggedIn(data) {
        return data.id === json_rpc_params_1.JsonRpcActionId.login;
    }
    static isOutgoingCall(data) {
        return data.id === json_rpc_params_1.JsonRpcActionId.invite;
    }
    static isMediaRequest(data) {
        return data.method === 'verto.media';
    }
}
exports.JsonRpcParser = JsonRpcParser;
//# sourceMappingURL=json-rpc.parser.js.map