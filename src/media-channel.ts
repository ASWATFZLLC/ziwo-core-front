import { ZiwoEvent, ZiwoErrorCode } from './events';

interface MicrophoneData {
  filterNode:BiquadFilterNode;
  gainNode:GainNode;
  source:MediaStreamAudioSourceNode;
}

export interface MediaInfo {
  selfTag:HTMLMediaElement;
  peerTag:HTMLMediaElement;
}

export class MediaChannel {

  public readonly stream:any;
  public remoteStream:any;

  private microphone?:MicrophoneData;

  private readonly audioContext:AudioContext;

  constructor(stream:any) {
    this.stream = stream;
    this.audioContext = this.getAudioContext();
  }

  public static getUserMediaAsChannel(mediaRequested:any):Promise<MediaChannel> {
    return new Promise<MediaChannel>((onRes, onErr) => {
      try {
        navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
          onRes(new MediaChannel(stream));
        }).catch(e => {
          ZiwoEvent.error(ZiwoErrorCode.DevicesError, 'No devices available');
        });
      } catch (e) {
        onErr(e);
      }
    });
  }

  public startMicrophone():void {
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

  public bindVideo(el:any):void {
    el.srcObject = this.stream;
  }

  private getAudioContext():AudioContext {
    let audioContext;
    if (typeof AudioContext === 'function') {
      audioContext = new AudioContext();
    } else {
      throw new Error('Web audio not supported');
    }
    return audioContext;
  }

}
