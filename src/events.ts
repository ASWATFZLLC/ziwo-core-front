import {Call} from './call';

/**
 * TODO : documentation
 */

export enum ErrorCode {
  InvalidPhoneNumber = 2,
  UserMediaError = 3,
  AgentNotConnected = 1,
  ProtocolError = 4,
}

export interface ErrorData {
  code:ErrorCode;
  message:string;
  data?:any;
}

export interface ZiwoEventHistory {
  state:ZiwoEventDetails;
  date:Date;
  dateUNIX:string;
}

export interface ZiwoEventDetails {
  type:ZiwoEventType;
  direction:'outbound'|'inbound';
  callID:string;
  primaryCallID:string;
  customerNumber:string;
  stateFlow:ZiwoEventHistory[];
  currentCall:Call;
}

export enum ZiwoErrorCode {
  ProtocolError = 1001,
}

export enum ZiwoEventType {
  Error = 'error',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Requesting = 'requesting',
  Trying = 'tring',
  Early = 'early',
  Ringing = 'ringing',
  Answering = 'answering',
  Active = 'active',
  Held = 'held',
  Hangup = 'hangup',
  Destroy = 'destroy',
  Recovering = 'recovering',
}

export class ZiwoEvent {

  public static listeners:Function[] = [];

  public static subscribe(func:Function):void {
    this.listeners.push(func);
  }

  public static emit(type:ZiwoEventType, data:ZiwoEventDetails):void {
    this.listeners.forEach(x => x(type, data));
    window.dispatchEvent(new CustomEvent(type, {detail: data}));
  }

  public static error(code:ZiwoErrorCode, data:any):void {
    window.dispatchEvent(new CustomEvent(ZiwoEventType.Error, {detail: {
      code: code,
      inner: data,
    }}));
  }

}
