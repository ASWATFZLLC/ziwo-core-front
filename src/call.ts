import {MediaChannel} from './media-channel';
import {Verto} from './verto/verto';
import {ZiwoEventType, ZiwoEvent} from './events';
import {VertoByeReason} from './verto/verto.params';

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
  private readonly initialPayload?:any;

  constructor(callId:string, verto:Verto, phoneNumber:string, login:string, rtcPeerConnection:RTCPeerConnection, direction:'outbound'|'inbound', initialPayload?:any) {
    this.verto = verto;
    this.callId = callId;
    this.verto = verto;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = verto.channel as MediaChannel;
    this.phoneNumber = phoneNumber;
    this.direction = direction;
    this.initialPayload = initialPayload;
    if (this.initialPayload && this.initialPayload.verto_h_primaryCallID) {
      this.primaryCallId = this.initialPayload.verto_h_primaryCallID;
    }
  }

  public answer():void {
    return this.verto.answerCall(this.callId, this.phoneNumber, this.rtcPeerConnection.localDescription?.sdp as string);
  }

  public hangup():void {
    this.pushState(ZiwoEventType.Hangup);
    this.verto.hangupCall(this.callId, this.phoneNumber,
      this.states.findIndex(x => x.state === ZiwoEventType.Answering) >= 0 ? VertoByeReason.NORMAL_CLEARING
        : (this.direction === 'inbound' ? VertoByeReason.CALL_REJECTED : VertoByeReason.ORIGINATOR_CANCEL));
  }

  public dtfm(char:string):void {
    this.verto.dtfm(this.callId, char);
  }

  public hold():void {
    this.verto.holdCall(this.callId, this.phoneNumber);
  }

  public unhold():void {
    this.verto.unholdCall(this.callId, this.phoneNumber);
  }

  public mute():void {
    this.toggleSelfStream(true);
    // Because mute is not sent/received over the socket, we throw the event manually
    this.pushState(ZiwoEventType.Mute);
  }

  public unmute():void {
    this.toggleSelfStream(false);
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
