
/**
 * TODO : documentation
 * TODO : define interface for each available type?
 * TODO : define all event type
 */

export enum ErrorCode {
  InvalidPhoneNumber = 2,
  UserMediaError = 3,
  AgentNotConnected = 1,
}

export interface ErrorData {
  code:ErrorCode;
  message:string;
  data?:any;
}

export enum ZiwoEventType {
  Error = 'Error',
  AgentConnected = 'AgentConnected',
  IncomingCall = 'IncomingCall',
  OutgoingCall = 'OutgoingCall',
  CallStarted = 'CallStarted',
  CallEndedByUser = 'CallEndedByUser',
  CallEndedByPeer = 'CallEndedByPeer',
}

export class ZiwoEvent {

  public static listeners:Function[] = [];

  public static subscribe(func:Function):void {
    this.listeners.push(func);
  }

  public static emit(type:ZiwoEventType, data?:any):void {
    this.listeners.forEach(x => x(type, data));
  }
}
