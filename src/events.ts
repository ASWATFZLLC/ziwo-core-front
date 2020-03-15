import {Call, CallState} from './call';

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
  currentCall:Call;
  callID:string;
  primaryCallID?:string;
  customerNumber:string;
  direction:'outbound'|'inbound'|'internal'|'service';
  stateFlow:CallState[];
  [key:string]:any; // allow additional information
}

export enum ZiwoErrorCode {
  ProtocolError = 1001,
  MediaError = 1002,
  MissingCall = 1003,
  CannotCreateCall = 1004,
}

export enum ZiwoEventType {
  Error = 'error',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Requesting = 'requesting',
  Trying = 'trying',
  Early = 'early',
  Ringing = 'ringing',
  Answering = 'answering',
  Active = 'active',
  Held = 'held',
  Hangup = 'hangup',
  Mute = 'mute',
  Unmute = 'unmute',
  Purge = 'purge',
  Destroy = 'destroy',
  Recovering = 'recovering',
}


/**
 * All phone call (outbound & inbound) will throw events during their lifetime.
 * Here is the expected cycle of a phone call:
 *  1. requesting (event thrown only for outbound call)
 *  2. trying (event thrown only for outbound call)
 *  3. early (event thrown only for outbound call)
 *  4. ringing
 *  5. answering
 *  6. active (peers are able to talk)
 *  6.x call can changes states multiple time (hold, unhold, ...)
 *  7. hangup (call stops and peers are not able to talk anymore)
 *  8. purge (event is going to be destroy)
 *  9. event is destroyed
 *
 * All call not going through step 7, 8 and 9 will be automatically recovered in case user refresh the page
 */
export class ZiwoEvent {

  public static listeners:Function[] = [];
  private static prefixes = ['_jorel-dialog-state-', 'ziwo-'];

  private type:ZiwoEventType;
  private data:ZiwoEventDetails;


  constructor(type:ZiwoEventType, data:ZiwoEventDetails) {
    this.type = type;
    this.data = data;
  }

  public static subscribe(func:Function):void {
    this.listeners.push(func);
  }

  public static emit(type:ZiwoEventType, data:ZiwoEventDetails|any):void {
    this.listeners.forEach(x => x(type, data));
    this.dispatchEvents(type, data);
  }

  public static error(code:ZiwoErrorCode, data:any):void {
    this.dispatchEvents(ZiwoEventType.Error, {
      code: code,
      inner: data,
    });
  }

  private static dispatchEvents(type:ZiwoEventType, data:any):void {
    this.prefixes.forEach(p => window.dispatchEvent(new CustomEvent(`${p}${type}`, {detail: data})));
  }

  public emit():void {
    ZiwoEvent.emit(this.type, this.data);
  }

}
