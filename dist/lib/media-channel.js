"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MediaChannel {
    constructor(stream) {
        this.stream = stream;
        this.audioContext = this.getAudioContext();
    }
    static getUserMediaAsChannel(mediaRequested) {
        return new Promise((onRes, onErr) => {
            try {
                navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
                    onRes(new MediaChannel(stream));
                });
            }
            catch (e) {
                onErr(e);
            }
        });
    }
    startMicrophone() {
        // see https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
        const filterNode = this.audioContext.createBiquadFilter();
        filterNode.type = 'highpass';
        // cutoff frequency: for highpass, audio is attenuated below this frequency
        filterNode.frequency.value = 10000;
        // create a gain node (to change audio volume)
        const gainNode = this.audioContext.createGain();
        // default is 1 (no change); less than 1 means audio is attenuated and vice versa
        gainNode.gain.value = 0.5;
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.microphone = {
            filterNode,
            gainNode,
            source,
        };
    }
    bindVideo(el) {
        el.srcObject = this.stream;
    }
    getAudioContext() {
        let audioContext;
        if (typeof AudioContext === 'function') {
            audioContext = new AudioContext();
        }
        else {
            throw new Error('Web audio not supported');
        }
        return audioContext;
    }
}
exports.MediaChannel = MediaChannel;
//# sourceMappingURL=media-channel.js.map