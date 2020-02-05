export interface VertoEvent {
  type:VertoEventType;
  raw:any;
  payload:any; // should be casted into appropriate Interface based on the type
}

export enum VertoEventType {
  Unknown = 'Unknown',
  LoggedIn = 'LoggedIn',
  OutgoingCall = 'OutgoingCall',
  MediaRequest = 'MediaRequest',
}
