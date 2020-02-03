import {MediaChannel} from './media-channel';

/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:MediaChannel;

  constructor(callId:string, rtcPeerConnection:RTCPeerConnection, channel:MediaChannel) {
    this.callId = callId;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = channel;
  }

  public answer():void {
    console.warn('Answer not implemented');
  }

  public hangup():void {
    console.warn('Hangup not implemented');
  }

  public mute():void {
    console.warn('Mute not implemented');
  }

  public unmute():void {
    console.warn('Unmute not implemented');
  }

  public hold():void {
    console.warn('Hold not implemented');
  }

}
