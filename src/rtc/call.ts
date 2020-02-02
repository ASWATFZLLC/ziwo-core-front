
/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly rtcPeerConnection:RTCPeerConnection;

  constructor(callId:string, rtcPeerConnection:RTCPeerConnection) {
    this.callId = callId;
    this.rtcPeerConnection = rtcPeerConnection;
  }

}
