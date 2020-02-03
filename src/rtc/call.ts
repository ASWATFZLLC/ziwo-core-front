import {Channel} from './channel';

/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:Channel;

  constructor(callId:string, rtcPeerConnection:RTCPeerConnection, channel:Channel) {
    this.callId = callId;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = channel;
  }

  public answer():void {

  }

}
