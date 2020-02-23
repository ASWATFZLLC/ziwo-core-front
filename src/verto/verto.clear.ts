import {Verto} from './verto';
import {Call} from '../call';
import {ZiwoEventType} from '../events';

export class VertoClear {

  private verto:Verto;
  private debug:boolean;

  constructor(verto:Verto, debug:boolean) {
    this.verto = verto;
    this.debug = debug;
  }

  /**
   * When user closes the tab, we need to purge the call:
   *  - for on going call(s): purge
   *  - for ended call(s): purge + destroy
   */
  public prepareUnloadEvent():void {
    window.addEventListener('unload', (e) => {
      this.purge(this.verto.calls);
      this.destroy(this.verto.calls.filter(c => c.states.findIndex(x => x.state === ZiwoEventType.Hangup) >= 0));
    }, false);
  }

  private purge(calls:Call[]):void {

  }

  private destroy(call:Call[]):void {

  }

}
