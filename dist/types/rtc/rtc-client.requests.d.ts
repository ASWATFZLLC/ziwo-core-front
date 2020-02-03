import { RtcClientBase } from './rtc-client.base';
import { VideoInfo } from './channel';
export declare class RtcClientRequests extends RtcClientBase {
    constructor(tags: VideoInfo, debug?: boolean);
    startCall(phoneNumber: string): void;
}
