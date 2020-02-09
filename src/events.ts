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

export interface ZiwoEventDetails {
  type:ZiwoEventType;
  call:Call;
  [key:string]:any; // allow additional information
}

export enum ZiwoErrorCode {
  ProtocolError = 1001,
  MediaError = 1002,
  MissingCall = 1003,
}

export enum ZiwoEventType {
  Error = 'error',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Requesting = 'requesting',
  Trying = 'tring',
  Ringing = 'ringing',
  Answering = 'answering',
  Active = 'active',
  Held = 'held',
  Hangup = 'hangup',
  Mute = 'mute',
  Unmute = 'unmute',
  Destroy = 'destroy',
  Recovering = 'recovering',
}

export class ZiwoEvent {

  public static listeners:Function[] = [];

  private type:ZiwoEventType;
  private data:ZiwoEventDetails;

  constructor(type:ZiwoEventType, data:ZiwoEventDetails) {
    this.type = type;
    this.data = data;
  }

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

  public emit():void {
    ZiwoEvent.emit(this.type, this.data);
  }

}
