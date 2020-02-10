import {MediaChannel} from './media-channel';
import {Verto} from './verto/verto';
import {ZiwoEventType, ZiwoEvent} from './events';
import { RTCPeerConnectionFactory } from './verto/RTCPeerConnection.factory';

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
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:MediaChannel;
  public readonly verto:Verto;
  public readonly phoneNumber:string;
  public readonly direction:'outbound'|'inbound';
  public readonly states:CallState[] = [];
  private status:CallComponentsStatus = {
    call: CallStatus.Running,
    microphone: CallStatus.Running,
    camera: CallStatus.Stopped,
  };
  private readonly outboundDetails?:any;

  constructor(callId:string, verto:Verto, phoneNumber:string, login:string, direction:'outbound'|'inbound', outboundDetails?:any) {
    this.verto = verto;
    this.callId = callId;
    this.verto = verto;
    this.rtcPeerConnection = direction === 'outbound' ?
      RTCPeerConnectionFactory.outbound(verto, callId, login, phoneNumber) :
      RTCPeerConnectionFactory.inbound(verto, callId, login, outboundDetails.sdp);
    this.channel = verto.channel as MediaChannel;
    this.phoneNumber = phoneNumber;
    this.direction = direction;
    this.outboundDetails = outboundDetails;
  }

  public getCallStatus():CallComponentsStatus {
    return this.status;
  }

  public answer():Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      if (!this.outboundDetails) {
        return onErr('Invalid SDP');
      }
      this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: this.outboundDetails.sdp}))
        .then(r => {
          return onRes();
        }).catch(e => onErr(e));
    });
  }

  public hangup():void {
    this.verto.hangupCall(this.callId, this.phoneNumber);
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
    // Because mute is not send/received over the socket, we throw the event manually from
    this.pushState(ZiwoEventType.Mute);
  }

  public unmute():void {
    this.toggleSelfStream(false);
    this.status.microphone = CallStatus.Running;
    this.pushState(ZiwoEventType.Unmute);
    // Because unmute is not send/received over the socket, we throw the event manually from
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
        call: this,
      });
    }
  }

  private toggleSelfStream(enabled:boolean):void {
    this.channel.stream.getAudioTracks().forEach((tr:any) => {
      tr.enabled = enabled;
    });
  }

}
