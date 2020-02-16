import {MediaChannel} from './media-channel';
import {Verto} from './verto/verto';
import {ZiwoEventType, ZiwoEvent} from './events';
import {RTCPeerConnectionFactory} from './verto/RTCPeerConnection.factory';
import { VertoByeReason } from './verto/verto.params';

export enum CallStatus {
  Stopped = 'stopped',
  Running = 'running',
  OnHold = 'onHold',
}

export interface CallComponentsStatus {
  call:CallStatus;
  microphone:CallStatus;
  camera:CallStatus;
}

export interface CallState {
  state:ZiwoEventType;
  date:Date;
  dateUNIX:number;
}

/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly primaryCallId?:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:MediaChannel;
  public readonly verto:Verto;
  public readonly phoneNumber:string;
  public readonly direction:'outbound'|'inbound'|'internal'|'service';
  public readonly states:CallState[] = [];
  private status:CallComponentsStatus = {
    call: CallStatus.Running,
    microphone: CallStatus.Running,
    camera: CallStatus.Stopped,
  };
  private readonly outboundDetails?:any;

  constructor(callId:string, verto:Verto, phoneNumber:string, login:string, rtcPeerConnection:RTCPeerConnection, direction:'outbound'|'inbound', outboundDetails?:any) {
    this.verto = verto;
    this.callId = callId;
    this.verto = verto;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = verto.channel as MediaChannel;
    this.phoneNumber = phoneNumber;
    this.direction = direction;
    this.outboundDetails = outboundDetails;
    if (this.direction === 'inbound') {
      this.primaryCallId = outboundDetails.verto_h_primaryCallID;
    }
  }

  public getCallStatus():CallComponentsStatus {
    return this.status;
  }

  public answer():void {
    return this.verto.answerCall(this.callId, this.phoneNumber, this.rtcPeerConnection.localDescription?.sdp as string);
  }

  public hangup():void {
    this.verto.hangupCall(this.callId, this.phoneNumber,
      this.states.findIndex(x => x.state === ZiwoEventType.Answering) >= 0 ? VertoByeReason.NORMAL_CLEARING
        : (this.direction === 'inbound' ? VertoByeReason.CALL_REJECTED : VertoByeReason.ORIGINATOR_CANCEL));
    this.status.call = CallStatus.Stopped;
  }

  public hold():void {
    this.verto.holdCall(this.callId, this.phoneNumber);
    this.status.call = CallStatus.OnHold;
  }

  public unhold():void {
    this.verto.unholdCall(this.callId, this.phoneNumber);
    this.status.call = CallStatus.Running;
  }

  public mute():void {
    this.toggleSelfStream(true);
    this.status.microphone = CallStatus.OnHold;
    // Because mute is not sent/received over the socket, we throw the event manually
    this.pushState(ZiwoEventType.Mute);
  }

  public unmute():void {
    this.toggleSelfStream(false);
    this.status.microphone = CallStatus.Running;
    this.pushState(ZiwoEventType.Unmute);
    // Because unmute is not sent/received over the socket, we throw the event manually
  }

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
    this.channel.stream.getAudioTracks().forEach((tr:any) => {
      tr.enabled = enabled;
    });
  }

}
