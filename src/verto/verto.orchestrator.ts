import {VertoMessage, VertoMethod, VertoNotification, VertoState, VertoNotificationMessage} from './verto.params';
import {ZiwoEvent, ZiwoEventType, ZiwoEventDetails, ZiwoErrorCode} from '../events';
import {Call} from '../call';
import {Verto} from './verto';
import {RTCPeerConnectionFactory} from './RTCPeerConnection.factory';
import { HTMLMediaElementFactory } from './HTMLMediaElement.factory';

/**
 * Verto Orchestrator can be seen as the core component of our Verto implemented
 * Its role is to read all incoming message and act appropriately:
 *  - broadcast important messages as ZiwoEvent (incoming call, call set on hold, call answered, ...)
 *  - run appropriate commands if required by verto protocol (bind stream on verto.mediaRequest, clear call if verto.callDestroyed, ...)
 */
export class VertoOrchestrator {

  private readonly debug:boolean;
  private readonly verto:Verto;

  constructor(verto:Verto, debug:boolean) {
    this.debug = debug;
    this.verto = verto;
  }

  /**
   * We can identify 2 types of inputs:
   *  - message (or request): contains a `method` and usually requires further actions
   *  - notication: does not contain a `method` and does not require further actions. Provide call's update (hold, unhold, ...)
   */
  public onInput(message:any, call:Call|undefined):void {
    return message.method ? this.handleMessage(message, call) : this.handleNotification(message, call);
  }

  private handleMessage(message:VertoMessage<any>, call:Call|undefined):void {
    if (this.debug) {
      console.log('Incoming message ', message);
    }
    switch (message.method) {
      case VertoMethod.ClientReady:
        return this.onClientReady(message);
      case VertoMethod.Send:
        return this.onSend(message);
      case VertoMethod.Attach:
        return this.onAttach(message);
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
        if (this.ensureCallIsExisting(call)) {
          const c = call as Call;
          if (c.states && c.states.length > 0 && c.states[c.states.length - 1].state !== ZiwoEventType.Active) {
            c.pushState(ZiwoEventType.Active);
          }
        }
        break;
      case VertoMethod.Pickup:
        if (this.ensureCallIsExisting(call)) {
          this.pickup(message, call as Call);
        }
        break;
      case VertoMethod.Bye:
        if (this.ensureCallIsExisting(call)) {
          (call as Call).pushState(ZiwoEventType.Hangup);
          this.verto.purgeAndDestroyCall((call as Call).callId);
        }
        break;
      case VertoMethod.Dial:
        this.verto.startCall(message.params.number, message.params.uuid);
        break;
    }
    return undefined;
  }

  private handleNotification(message:VertoNotification<any>, call:Call|undefined):void {
    if (this.debug) {
      console.log('Incoming notification ', message);
    }
    if (message.result && message.result.message) {
      switch (message.result.message) {
        case VertoNotificationMessage.CallCreated:
          if (this.ensureCallIsExisting(call)) {
            (call as Call).pushState(ZiwoEventType.Early);
          }
          break;
        case VertoNotificationMessage.CallEnded:
          if (this.ensureCallIsExisting(call)) {
            (call as Call).pushState(ZiwoEventType.Hangup);
          }
      }
    }
    if (message.result && message.result.action) {
      switch (message.result.action) {
        case VertoState.Hold:
          return !this.ensureCallIsExisting(call) ? undefined
            : this.onHold(call as Call);
        case VertoState.Unhold:
          return !this.ensureCallIsExisting(call) ? undefined
            : this.onUnhold(call as Call);
      }
    }
    return undefined;
  }

  private onClientReady(message:VertoMessage<any>):void {
    ZiwoEvent.emit(ZiwoEventType.Connected, {
      agent: this.verto.connectedAgent,
      contactCenterName: this.verto.contactCenterName,
    } as any);
  }

  private onSend(message: VertoMessage<any>): void {
    ZiwoEvent.emit(ZiwoEventType.VertoSend, {
      callParams: message.params.data
    } as any);
  }

  /***
   *** MESSAGE SECTION
   ***/

  /**
   * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
   * It should be transparent to users. No need to broadcast the event
   */
  private onMedia(message:VertoMessage<any>, call:Call):void {
    call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: message.params.sdp}))
      .then(() => {
        if (this.debug) {
          console.log('Remote media connected');
        }
        call.pushState(ZiwoEventType.MediaConnected);
      }).catch(() => {
        if (this.debug) {
          console.warn('fail to attach remote media');
        }
      });
  }

  private onInvite(message:VertoMessage<any>):void {
    RTCPeerConnectionFactory
      .inbound(this.verto, message.params)
      .then(res => {
        const pc = res[0];
        const channel = res[1];
        const call = new Call(
          message.params.callID,
          this.verto,
          message.params.verto_h_originalCallerIdNumber ? message.params.verto_h_originalCallerIdNumber : message.params.caller_id_number,
          this.verto.getLogin(),
          pc,
          channel,
          'inbound',
          message.params,
        );
        this.verto.calls.push(call);
        call.pushState(ZiwoEventType.Ringing);
      });
  }

  /**
   * Automatically create a phone call instance and reply to it in the background
   * used for Zoho CTI
   */
  private pickup(message:VertoMessage<any>, call:Call):void {
    call.answer();
  }

  /** Recovering call */
  private onAttach(message:VertoMessage<any>):void {
    RTCPeerConnectionFactory.recovering(this.verto, message.params, message.params.display_direction)
    .then(res => {
      const pc = res[0];
      const channel = res[1];
      const call = new Call(
        message.params.callID,
        this.verto,
        message.params.display_direction === 'inbound' ? message.params.callee_id_number : message.params.caller_id_number,
        this.verto.getLogin(),
        pc,
        channel,
        message.params.display_direction,
        message.params
      );
      this.verto.calls.push(call);
      // so SDP has time to build
      window.setTimeout(() => call.pushState(ZiwoEventType.Recovering), 500);
    });
  }

  /**
   * Call has been answered by remote. Broadcast the event
   */
  private onAnswer(message:VertoMessage<any>, call:Call):void {
    call.pushState(ZiwoEventType.Answering);
  }

  /***
   *** NOTIFICATION SECTION
   ***/

  private onHold(call:Call):void {
    call.pushState(ZiwoEventType.Held);
  }

  private onUnhold(call:Call):void {
    call.pushState(ZiwoEventType.Unheld);
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
