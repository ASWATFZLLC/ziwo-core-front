import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {RtcClientBase} from './rtc-client.base';
import {VideoInfo} from './channel';
import {ZiwoEventType, ZiwoEvent, ErrorCode} from '../events';
import { JsonRpcParams } from './json-rpc.params';

export class RtcClientRequests extends RtcClientBase {

  constructor(tags:VideoInfo, debug?:boolean) {
    super(tags, debug);
  }

  public startCall(phoneNumber:string):void {
    if (!this.isAgentConnected() || !this.channel || !this.jsonRpcClient) {
      this.sendNotConnectedEvent('start call');
      return;
    }
    if (!PATTERNS.phoneNumber.test(phoneNumber)) {
      return ZiwoEvent.emit(ZiwoEventType.Error, {
        code: ErrorCode.InvalidPhoneNumber,
        message: MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
        data: {
          phoneNumber: phoneNumber,
        }
      });
    }
    this.channel?.startMicrophone();
    this.calls.push(this.jsonRpcClient.startCall(phoneNumber, JsonRpcParams.getUuid(), this.channel, this.tags));
    console.log(this.calls);
  }

}
