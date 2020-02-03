export interface VideoInfo {
    selfTag: HTMLMediaElement;
    peerTag: HTMLMediaElement;
}
export declare class Channel {
    readonly stream: any;
    remoteStream: any;
    private microphone?;
    private readonly audioContext;
    constructor(stream: any);
    startMicrophone(): void;
    bindVideo(el: any): void;
    private getAudioContext;
}
