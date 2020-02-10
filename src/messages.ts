const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';

export const MESSAGES = {
  EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`,
  INVALID_PHONE_NUMBER: (phoneNumber:string) => `${phoneNumber} is not a valid phone number`,
  AGENT_NOT_CONNECTED: (action:string) => `Agent is not connected. Cannot proceed '${action}'`,
  MEDIA_ERROR: `${MESSAGE_PREFIX}User media are not available`,
};
