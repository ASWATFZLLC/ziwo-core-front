import {OutgoingCallPayload} from './json-rpc.interfaces';
import {RtcClientRequests} from './rtc-client.requests';
import {VideoInfo} from './channel';

export class RtcClientHandlers extends RtcClientRequests {

  constructor(video?:VideoInfo, debug?:boolean) {
    super(video, debug);
  }

  protected outgoingCall(data:OutgoingCallPayload):void {
    if (this.currentCall) {
      return console.warn('Outgoing Call - but there is already a call in progress');
    }
  }

}
