export interface VideoInfo {
    selfTag?: Element;
    peerTag?: Element;
}
export declare class Channel {
    readonly stream: any;
    private microphone?;
    private readonly audioContext;
    constructor(stream: any);
    startMicrophone(): void;
    bindVideo(el: any): void;
    private getAudioContext;
}
