"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const messages_1 = require("../messages");
/**
 * RtcClientBase handles authentication and holds core properties
 */
class RtcClientBase {
    constructor(tags, debug) {
        this.calls = [];
        this.debug = debug || false;
        this.tags = tags;
    }
    /**
     * Get connected Agent returns the Info of the current agent
     */
    getConnectedAgent() {
        return this.connectedAgent;
    }
    /**
     * Return true if an agent is connected
     */
    isAgentConnected() {
        return !!this.connectedAgent && !!this.channel;
    }
    sendNotConnectedEvent(action) {
        return events_1.ZiwoEvent.emit(events_1.ZiwoEventType.Error, {
            code: events_1.ErrorCode.InvalidPhoneNumber,
            message: messages_1.MESSAGES.AGENT_NOT_CONNECTED(action),
        });
    }
}
exports.RtcClientBase = RtcClientBase;
//# sourceMappingURL=rtc-client.base.js.map