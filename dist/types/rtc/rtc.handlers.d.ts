import { OutgoingCallPayload } from './json-rpc.interfaces';
import { RtcClient } from './rtc-client';
export declare class RtcHandlers {
    static OutgoingCall(rtcClient: RtcClient, data: OutgoingCallPayload): void;
}
