import {VertoMessage, VertoMethod, VertoLogin, VertoNotification, VertoAction} from './verto.params';
import {ZiwoEvent, ZiwoEventType, ZiwoEventDetails, ZiwoErrorCode} from '../events';
import {Call} from '../call';
import { Verto } from './verto';

/**
 * Verto Orchestrator can be seen as the core component of our Verto implemented
 * Its role is to read all incoming message and act appropriately:
 *  - broadcast important messages as ZiwoEvent (incoming call, call set on hold, call answered, ...)
 *  - run appropriate commands if required by verto protocol (bind stream on verto.mediaRequest, clear call if verto.callDestroyed, ...)
 */
export class VertoOrchestrator {

  private readonly debug:boolean;
  private readonly verto:Verto;
  private readonly CALL_ENDED_NOTIFICATION = 'CALL ENDED';

  constructor(verto:Verto, debug:boolean) {
    this.debug = debug;
    this.verto = verto;
  }

  /**
   * We can identify 2 types of inputs:
   *  - message (or request): contains a `method` and usually requires further actions
   *  - notication: does not contain a `method` and does not require further actions. Provide call's update (hold, unhold, ...)
   */
  public onInput(message:any, call:Call|undefined):ZiwoEvent|undefined {
    return message.method ? this.handleMessage(message, call) : this.handleNotification(message, call);
  }

  private handleMessage(message:VertoMessage<any>, call:Call|undefined):ZiwoEvent|undefined {
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
      case VertoMethod.Display:
        // Not sure what is the purpose of this
        return undefined;
    }
    return undefined;
  }

  private handleNotification(message:VertoNotification<any>, call:Call|undefined):ZiwoEvent|undefined {
    if (this.debug) {
      console.log('Incoming notification ', message);
    }
    if (!message.result || !message.result.action) {
      // Call ended does not have action but message 'CALL ENDED' only
      if (message.result.message === this.CALL_ENDED_NOTIFICATION && this.ensureCallIsExisting(call)) {
        return this.handleCallEnded(message, call as Call);
      }
      return undefined;
    }

    switch (message.result.action) {
      case VertoAction.Hold:
        return !this.ensureCallIsExisting(call) ? undefined
          : this.onHold(call as Call);
      case VertoAction.Unhold:
        return !this.ensureCallIsExisting(call) ? undefined
          : this.onUnhold(call as Call);
    }
    return undefined;
  }

  private handleCallEnded(message:VertoNotification<any>, call:Call):ZiwoEvent {
    call.pushState(ZiwoEventType.Hangup);
    return new ZiwoEvent(ZiwoEventType.Hangup, {
      type: ZiwoEventType.Hangup,
      call: call,
      reason: message.result.cause,
    });
  }

  private onClientReady(message:VertoMessage<any>):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Connected, {} as ZiwoEventDetails);
  }

  /***
   *** MESSAGE SECTION
   ***/

  /**
   * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
   * It should be transparent to users. No need to broadcast the event
   */
  private onMedia(message:VertoMessage<any>, call:Call):undefined {
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
    return undefined;
  }

  private onInvite(message:VertoMessage<any>):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Ringing, {
      type: ZiwoEventType.Ringing,
      call: new Call(
        message.params.callID,
        this.verto,
        message.params.verto_h_originalCallerIdNumber,
        this.verto.getLogin(),
        'inbound',
        message.params,
      ),
    });
  }

  /**
   * Call has been answered by remote. Broadcast the event
   */
  private onAnswer(message:VertoMessage<any>, call:Call):ZiwoEvent {
    return new ZiwoEvent(ZiwoEventType.Answering, {
      type: ZiwoEventType.Answering,
      call: call,
    });
  }

  /***
   *** NOTIFICATION SECTION
   ***/

  private onHold(call:Call):ZiwoEvent|undefined {
    call.pushState(ZiwoEventType.Held);
    return new ZiwoEvent(ZiwoEventType.Held, {
      type: ZiwoEventType.Held,
      call: call,
    });
  }

  private onUnhold(call:Call):ZiwoEvent|undefined {
    call.pushState(ZiwoEventType.Active);
    return new ZiwoEvent(ZiwoEventType.Active, {
      type: ZiwoEventType.Active,
      call: call,
    });
  }

  /***
   *** OTHERS
   ***/

  /**
   * ensureCallIsExisting makes sure the call is not undefined.
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
