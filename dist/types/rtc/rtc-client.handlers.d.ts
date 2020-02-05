import { MediaInfo } from './media-channel';
import { RtcClientBase } from './rtc-client.base';
import { OutgoingCallPayload, MediaRequestPayload } from './verto.base';
export declare class RtcClientHandlers extends RtcClientBase {
    constructor(tags: MediaInfo, debug?: boolean);
    protected outgoingCall(data: OutgoingCallPayload): void;
    protected acceptMediaRequest(data: MediaRequestPayload): void;
}
