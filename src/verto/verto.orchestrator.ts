import {VertoMessage, VertoMethod, VertoLogin} from './verto.params';
import {ZiwoEvent, ZiwoEventType, ZiwoEventDetails, ZiwoErrorCode} from '../events';
import {Call} from '../call';

export class VertoOrchestrator {

  private readonly debug:boolean;

  constructor(debug:boolean) {
    this.debug = debug;
  }

  public handleMessage(message:VertoMessage<any, any>, call:Call|undefined):ZiwoEvent|undefined {
    if (!message.method) {
      // Message with no methods are simple nofitications. We ignore them for now
      if (this.debug) {
        console.log('Incoming notification', message);
      }
      return;
    }
    if (this.debug) {
      console.log('Incoming message ', message);
    }
    switch (message.method) {
      case VertoMethod.ClientReady:
        return this.onClientReady(message);

      case VertoMethod.Media:
        return !this.ensureCallIsExisting(call) ? undefined
          : this.onMedia(message, call as Call);

      case VertoMethod.Invite:
        this.pushState(call, ZiwoEventType.Trying);
        return this.onInvite(message);

      case VertoMethod.Answer:
        this.pushState(call, ZiwoEventType.Answering);
        return !this.ensureCallIsExisting(call) ? undefined
          : this.onAnswer(message, call as Call);

      case VertoMethod.Modify:
        return this.onModify(message);

      case VertoMethod.Bye:
        return this.onBye(message);
    }
  }

  private onClientReady(message:VertoMessage<any, any>):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Connected, {} as ZiwoEventDetails);
  }

  /**
   * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
   * It should be transparent to users. No need to broadcast the event
   */
  private onMedia(message:VertoMessage<any, any>, call:Call):ZiwoEvent {
    call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: message.params.sdp}))
      .then(() => {
        if (this.debug) {
          console.log('Remote media connected');
        }
      }).catch(() => {
        if (this.debug) {
          console.warn('fail to attach remote media');
        }
      });
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  private onInvite(message:VertoMessage<any, any>):ZiwoEvent {
    console.log('Invite', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  /**
   * Call has been answered by remote. Broadcast the event
   */
  private onAnswer(message:VertoMessage<any, any>, call:Call):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Answering, {
      type: ZiwoEventType.Answering,
      direction: 'remote',
      call: call,
    });
  }

  private onModify(message:VertoMessage<any, any>):ZiwoEvent {
    console.log('Modify', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  private onBye(message:VertoMessage<any, any>):ZiwoEvent {
    console.log('Bye', message);
    return new ZiwoEvent(ZiwoEventType.Error, {} as ZiwoEventDetails);
  }

  /**
   * ensulteCallIsExisting makes sure the call is not undefined.
   * If it is undefined, throw a meaningful error message
   */
  private ensureCallIsExisting(call:Call|undefined):boolean {
    if (!call) {
      ZiwoEvent.error(ZiwoErrorCode.MissingCall, 'Received event from unknown callID');
      return false;
    }
    return true;
  }

  private pushState(call:Call|undefined, state:ZiwoEventType):void {
    if (call) {
      call.pushState(state);
    }
  }

}
