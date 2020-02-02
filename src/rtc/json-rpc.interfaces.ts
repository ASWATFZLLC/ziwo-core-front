
export interface JsonRpcEvent {
  type:JsonRpcEventType;
  payload:any; // should be casted into appropriate Interface based on the type
}

export enum JsonRpcEventType {
  Unknown = 'Unknown',
  LoggedIn = 'LoggedIn',
  OutgoingCall = 'OutgoingCall',
}

export interface LoggedInPayload {
  sessid:string;
}
