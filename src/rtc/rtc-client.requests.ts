import {PATTERNS} from '../regex';
import {MESSAGES} from '../messages';
import {RtcClientBase} from './rtc-client.base';
import {VideoInfo} from './channel';
import {ZiwoEventType, ZiwoEvent, ErrorCode} from '../events';

export class RtcClientRequests extends RtcClientBase {

  constructor(video?:VideoInfo, debug?:boolean) {
    super(video, debug);
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
    this.jsonRpcClient.startCall(phoneNumber);
  }

  public startVideoCall(phoneNumber:string):void {
    if (!this.isAgentConnected() || !this.channel) {
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
    if (this.videoInfo && this.videoInfo.selfTag) {
      this.channel.bindVideo(this.videoInfo.selfTag);
    }
    ZiwoEvent.emit(ZiwoEventType.OutgoingCall, {
      audio: true,
      video: true,
    });
  }

}
