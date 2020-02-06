import {VertoMessage, VertoMethod, VertoLogin} from './verto.params';
import {ZiwoEvent, ZiwoEventType, ZiwoEventDetails} from '../events';

export class VertoOrchestrator {

  private readonly debug:boolean;

  constructor(debug:boolean) {
    this.debug = debug;
  }

  public handleMessage(message:VertoMessage<any>):ZiwoEvent|undefined {
    if (this.debug) {
      console.log('Handle incoming message ', message);
    }
    if (!message.method) {
      // Message with no methods are nofitications. We ignore them for now
      return;
    }
    switch (message.method) {
      case VertoMethod.ClientReady:
        return this.onClientReady(message);
      case VertoMethod.Invite:
        return this.onInvite(message);
      case VertoMethod.Modify:
        return this.onModify(message);
      case VertoMethod.Bye:
        return this.onBye(message);
    }
  }

  private onClientReady(message:VertoMessage<any>):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Connected, {} as ZiwoEventDetails);
  }

  private onInvite(message:VertoMessage<any>):ZiwoEvent {
    console.log('Invite', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  private onModify(message:VertoMessage<any>):ZiwoEvent {
    console.log('Modify', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  private onBye(message:VertoMessage<any>):ZiwoEvent {
    console.log('Bye', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

}
