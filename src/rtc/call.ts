import {MediaChannel} from './media-channel';
import {Verto} from './verto';

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

/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:MediaChannel;
  public readonly jsonRpcClient:Verto;
  public readonly phoneNumber:string;
  private status:CallComponentsStatus = {
    call: CallStatus.Running,
    microphone: CallStatus.Running,
    camera: CallStatus.Stopped,
  };

  constructor(callId:string, jsonRpcClient:Verto, rtcPeerConnection:RTCPeerConnection, channel:MediaChannel, phoneNumber:string) {
    this.jsonRpcClient = jsonRpcClient;
    this.callId = callId;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = channel;
    this.phoneNumber = phoneNumber;
  }

  public getCallStatus():CallComponentsStatus {
    return this.status;
  }

  public answer():void {
    console.warn('Answer not implemented');
  }

  public hangup():void {
    this.jsonRpcClient.hangupCall(this.callId, this.phoneNumber);
    this.status.call = CallStatus.Stopped;
  }

  public hold():void {
    this.jsonRpcClient.holdCall(this.callId, this.phoneNumber);
    this.status.call = CallStatus.OnHold;
  }

  public unhold():void {
    this.jsonRpcClient.unholdCall(this.callId, this.phoneNumber);
    this.status.call = CallStatus.Running;
  }

  public mute():void {
    this.toggleSelfStream(true);
    this.status.microphone = CallStatus.OnHold;
  }

  public unmute():void {
    this.toggleSelfStream(false);
    this.status.microphone = CallStatus.Running;
  }

  private toggleSelfStream(enabled:boolean):void {
    this.channel.stream.getAudioTracks().forEach((tr:any) => {
      tr.enabled = enabled;
    });
  }

}
