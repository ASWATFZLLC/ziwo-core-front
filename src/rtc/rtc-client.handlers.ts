import {OutgoingCallPayload, MediaRequestPayload} from './json-rpc.interfaces';
import {MediaInfo} from './media-channel';
import {RtcClientBase} from './rtc-client.base';

export class RtcClientHandlers extends RtcClientBase {

  constructor(tags:MediaInfo, debug?:boolean) {
    super(tags, debug);
  }

  protected outgoingCall(data:OutgoingCallPayload):void {
    if (this.currentCall) {
      return console.warn('Outgoing Call - but there is already a call in progress');
    }
  }

  protected acceptMediaRequest(data:MediaRequestPayload):void {
    const call = this.calls.find(x => x.callId === data.callID);
    if (!call) {
      return ; // invalid call id?
    }
    call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: data.sdp}))
      .then(() => console.log('Remote media connected'))
      .catch(() => console.warn('fail to attach remote media'));
    // call.answer();
  }

}
