
interface MicrophoneData {
  filterNode:BiquadFilterNode;
  gainNode:GainNode;
  source:MediaStreamAudioSourceNode;
}

export interface VideoInfo {
  selfTag?:Element;
  peerTag?:Element;
}

export class Channel {

  public readonly stream:any;

  private microphone?:MicrophoneData;

  private readonly audioContext:AudioContext;

  constructor(stream:any) {
    this.stream = stream;
    this.audioContext = this.getAudioContext();
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
    if (!el.srcObject) {
      // TODO : emit appropriate error message
      return;
    }
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
