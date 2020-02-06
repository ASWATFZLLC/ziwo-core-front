import {VertoMessage} from './verto.params';

export class VertoOrchestrator {

  private readonly debug:boolean;

  constructor(debug:boolean) {
    this.debug = debug;
  }

  public handleMessage(message:any):void {
    console.log('Handle incoming message ', message);
  }

}
