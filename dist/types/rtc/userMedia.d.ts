import { MediaChannel } from './media-channel';
export interface MediaRequested {
    audio?: boolean;
    video?: {
        selfTag: Element;
        peerTag: Element;
    };
}
export declare class UserMedia {
    static getUserMedia(mediaRequested: UserMedia): Promise<MediaChannel>;
}
