
/**
 * TODO : documentation
 * TODO : define interface for each available type?
 * TODO : define all event type
 */

export enum ZiwoEventType {
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

  public static emit(type:ZiwoEventType, data:any):void {
    this.listeners.forEach(x => x(type, data));
  }
}
