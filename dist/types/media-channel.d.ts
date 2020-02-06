export interface MediaInfo {
    selfTag: HTMLMediaElement;
    peerTag: HTMLMediaElement;
}
export declare class MediaChannel {
    readonly stream: any;
    remoteStream: any;
    private microphone?;
    private readonly audioContext;
    constructor(stream: any);
    static getUserMediaAsChannel(mediaRequested: any): Promise<MediaChannel>;
    startMicrophone(): void;
    bindVideo(el: any): void;
    private getAudioContext;
}
