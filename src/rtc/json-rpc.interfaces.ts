
export interface JsonRpcEvent {
  type:JsonRpcEventType;
  payload:any; // should be casted into appropriate Interface based on the type
}

export enum JsonRpcEventType {
  Unknown = 'Unknown',
  LoggedIn = 'LoggedIn',
  OutgoingCall = 'OutgoingCall',
}

export interface BasePayload {
  sessid:string;
}

export interface LoggedInPayload extends BasePayload { }

export interface OutgoingCallPayload extends BasePayload {
  CallID:string;
  message:string;
}
