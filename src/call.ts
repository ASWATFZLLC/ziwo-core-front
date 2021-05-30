import {MediaChannel} from './media-channel';
import {Verto} from './verto/verto';
import {ZiwoEventType, ZiwoEvent} from './events';
import {VertoByeReason} from './verto/verto.params';
import {Device} from './io';

export enum CallStatus {
  Stopped = 'stopped',
  Running = 'running',
  OnHold = 'onHold',
}

export interface CallState {
  state:ZiwoEventType;
  date:Date;
  dateUNIX:number;
}

/**
 * Call hold a physical instance of a call.
 * They provide useful information but also methods to change the state of the call.
 *
 * @callId : unique identifier used for Jorel protocol
 * @primaryCallId : link to first call of the chain if existing
 * @rtcPeerConnection : the WebRTC interface
 * @channel : holds the media stream (input/output)
 * @verto : holds a reference to Verto singleton
 * @phoneNumber : peer phone number
 * @direction : call's direction
 * @states : array containing all the call's status update with a Datetime.
 * @initialPayload : complete payload received/sent to start the call
 */
export class Call {

  public readonly callId:string;
  public readonly primaryCallId?:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly verto:Verto;
  public readonly phoneNumber:string;
  public readonly direction:'outbound'|'inbound'|'internal'|'service';
  public readonly states:CallState[] = [];
  private readonly initialPayload?:any;

  constructor(callId:string, verto:Verto, phoneNumber:string, login:string, rtcPeerConnection:RTCPeerConnection, direction:'outbound'|'inbound', initialPayload?:any) {
    this.verto = verto;
    this.callId = callId;
    this.verto = verto;
    this.rtcPeerConnection = rtcPeerConnection;
    this.phoneNumber = phoneNumber;
    this.direction = direction;
    this.initialPayload = initialPayload;
    if (this.initialPayload && this.initialPayload.verto_h_primaryCallID) {
      this.primaryCallId = this.initialPayload.verto_h_primaryCallID;
    }
    // list for device updates and handle new input/output properly
    window.addEventListener('ziwo-output-changed', (ev:any) => this.useOutput(ev.detail.device));
    window.addEventListener('ziwo-input-changed', (ev:any) => this.useInput(ev.detail.device))
  }

  /**
   * Use when current state is `ringing` to switch the call to `active`
   */
  public answer():void {
    return this.verto.answerCall(this.callId, this.phoneNumber, this.rtcPeerConnection.localDescription?.sdp as string);
  }

  /**
   * Use when current state is 'ringing' or 'active' to stop the call
   */
  public hangup():void {
    this.pushState(ZiwoEventType.Hangup);
    let reason:VertoByeReason = VertoByeReason.NORMAL_CLEARING;
    if (this.direction === 'inbound' && this.states.findIndex(x => x.state === ZiwoEventType.Active) === -1) {
      reason = VertoByeReason.CALL_REJECTED;
    }
    if (this.direction === 'outbound' && this.states.findIndex(x => x.state === ZiwoEventType.Answering) === -1) {
      reason = VertoByeReason.ORIGINATOR_CANCEL;
    }
    this.verto.hangupCall(this.callId, this.phoneNumber, reason);
  }

  /**
   * Recover the call currently in recovering state
   */
  public recover():void {
    this.verto.attach(this.callId, this.phoneNumber, this.rtcPeerConnection.localDescription?.sdp as string);
  }

  /**
   * Use to send a digit
   */
  public dtmf(char:string):void {
    this.verto.dtmf(this.callId, this.phoneNumber, char);
  }

  /*
   * Update the used output
   */
  public useOutput(device:Device): void {
    console.log(`call ${this.callId} shoud use output > `, device);
    // const el = document.getElementById(`media-peer-${this.callId}`);
    // if (el) {
      // (el as HTMLVideoElement).srcObject = this.verto.io.channel?.stream;
    // }
  }

  /*
   * Update the used input
   */
  public useInput(device:Device): void {
    console.log(`call ${this.callId} should use input > `, device);
    const peer = this.rtcPeerConnection.getSenders().find(s => {
      if (!s || !s.track) {
        return false;
      }
      return s.track.kind === 'audioinput';
    });
    if (peer) {
      peer.replaceTrack(this.verto.io.channel?.stream);
    }
  }

  /**
   * Set the call on hold
   */
  public hold():void {
    this.verto.holdCall(this.callId, this.phoneNumber);
  }

  /**
   * Unhold the call
   */
  public unhold():void {
    // we hold other calls
    this.verto.calls.forEach(c => {
      if (c.callId !== this.callId) {
        c.hold();
      }
    });
    this.verto.unholdCall(this.callId, this.phoneNumber);
  }

  /**
   * Mute user's microphone
   */
  public mute():void {
    this.toggleSelfStream(false);
    // Because mute is not sent/received over the socket, we throw the event manually
    this.pushState(ZiwoEventType.Mute);
  }

  /**
   * Unmute user's microphone
   */
  public unmute():void {
    this.toggleSelfStream(true);
    this.pushState(ZiwoEventType.Unmute);
    // Because unmute is not sent/received over the socket, we throw the event manually
  }

  /**
   * Start an attended transfer.
   * Attended transfer set the current call on hold and call @destination
   * Use `proceedAttendedTransfer` to confirm the transfer
   */
  public attendedTransfer(destination:string):Call|undefined {
    this.hold();
    const call = this.verto.startCall(destination);
    if (!call) {
      return undefined;
    }
    this.verto.calls.push(call);
    return call;
  }

  /**
   * Confirm an attended transfer.
   * Stop the current call and create a new call between the initial correspondant and the @destination
   */
  public proceedAttendedTransfer(transferCall:Call):void {
    if (!transferCall) {
      return;
    }
    const destination = transferCall.phoneNumber;
    transferCall.hangup();
    this.blindTransfer(destination);
  }

  /**
   * Stop the current call and directly forward the correspondant to @destination
   */
  public blindTransfer(destination:string):void {
    this.verto.blindTransfer(destination, this.callId, this.phoneNumber);
  }

  /**
   * Push state add a new state in the stack and throw an event
   */
  public pushState(type:ZiwoEventType, broadcast = true):void {
    const d = new Date();
    this.states.push({
      state: type,
      date: d,
      dateUNIX: d.getTime() / 1000
    });
    if (broadcast) {
      ZiwoEvent.emit(type, {
        type,
        currentCall: this,
        primaryCallID: this.primaryCallId,
        callID: this.callId,
        direction: this.direction,
        stateFlow: this.states,
        customerNumber: this.phoneNumber,
      });
    }
  }

  private toggleSelfStream(enabled:boolean):void {
    // this.channel.stream.getAudioTracks().forEach((tr:any) => {
    //   tr.enabled = enabled;
    // });
  }

}
