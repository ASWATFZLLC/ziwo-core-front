import {Verto} from './verto';
import {Call} from '../call';
import {ZiwoEventType} from '../events';
import { HTMLMediaElementFactory } from './HTMLMediaElement.factory';

export class VertoClear {

  private verto:Verto;
  private debug:boolean;
  private readonly eventType:'unload'|'beforeunload';

  constructor(verto:Verto, debug:boolean) {
    this.verto = verto;
    this.debug = debug;
    this.eventType = this.debug ? 'beforeunload' : 'unload';
  }

  /**
   * When user closes the tab, we need to purge the call
   *  - for on going call(s): purge
   *  - for ended call(s): purge + destroy
   */
  public prepareUnloadEvent():void {
    window.addEventListener(this.eventType, (e) => {
      this.purge(this.verto.calls);
    }, false);
    if (this.debug) {
      /**
       * this display a validation popup before closing the tab.
       * Gives us time to check the console ;) || uncomment for testing
       */
      // window.onbeforeunload = () => {
      // return 'Purging calls';
      // };
    }
  }

  public destroyCall(call:Call):void {
    // if (call.channel.stream) {
    //   // tslint:disable-next-line: triple-equals
    //   if (typeof call.channel.stream.stop == 'function') {
    //     call.channel.stream.stop();
    //   } else {
    //     if (call.channel.stream.active) {
    //       const tracks = call.channel.stream.getTracks();
    //       tracks.forEach((tr:any) => tr.stop());
    //     }
    //   }
    // }
    // // tslint:disable-next-line: triple-equals
    // if (call.channel.remoteStream && call.channel.remoteStream == 'function') {
    //   call.channel.remoteStream.stop();
    // }
    HTMLMediaElementFactory.delete(this.verto.tag, call.callId);
  }

  private purge(calls:Call[]):void {
    if (this.debug) {
      console.log('PURGE > ', calls);
    }
    calls.forEach(c => this.verto.purgeCall(c.callId));
  }

}
