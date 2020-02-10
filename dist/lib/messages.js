"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
exports.MESSAGES = {
    EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`,
    INVALID_PHONE_NUMBER: (phoneNumber) => `${phoneNumber} is not a valid phone number`,
    AGENT_NOT_CONNECTED: (action) => `Agent is not connected. Cannot proceed '${action}'`,
    MEDIA_ERROR: `${MESSAGE_PREFIX}User media are not available`,
};
//# sourceMappingURL=messages.js.map