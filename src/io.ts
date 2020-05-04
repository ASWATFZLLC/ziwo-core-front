import { MediaInfo } from './media-channel';

interface Device {
  currentlyInUse:boolean;
  deviceId:string;
  groupId:string;
  label:string;
}

enum DeviceKind {
  VideoInput = 'videoinput',
  AudioInput = 'audioinput',
  AudioOutput = 'audiooutput',
}

/**
 * IO Service allow your to quickly manager your inputs and outputs
 */
export class IOService {

  private stream:any;
  private inputs:Device[] = [];
  private outputs:Device[] = [];
  private readonly tags:MediaInfo;

  constructor(tags:MediaInfo) {
    this.tags = tags;
    this.load();
  }

  /**
   * set @input as default input for calls
   */
  public useInput(input:any): void {

  }

  /**
   * set @output as default output for calls
   */
  public useOutput(outputId:string): void {
    (this.tags.peerTag as any).setSinkId(outputId).
      then(() => {
        console.log('Audio successfuly changed to ', outputId);
      }).catch();
  }

  /**
   * return all the available input medias
   */
  public getInputs(): void {

  }

  /**
   * return all the available output medias
   */
  public getOutput(): any[] {
    return this.outputs;
  }

  public load(): void {
    navigator.mediaDevices.getUserMedia({audio: true}).then(
      (stream) => this.getStream(stream),
    ).then(
      (devices) => this.getDevices(devices),
    ).catch();
    navigator.mediaDevices.enumerateDevices().then(
      (devices) => this.getDevices(devices),
    ).catch();
  }

  private getStream(stream:any): void {
    this.stream = stream;
  }

  private getDevices(devices:any): void {
    console.log(devices);
    if (!devices) {
      return;
    }
    console.log('peer output', (this.tags.peerTag as any).sinkId);
    console.log('peer output', (this.tags.selfTag as any).sinkId);
    devices.forEach((device:any) => {
      switch (device.kind) {
        case DeviceKind.VideoInput:
          // We do not do support video
          break;
        case DeviceKind.AudioInput:
          this.inputs.push({
            currentlyInUse: false,
            label: device.label,
            deviceId: device.deviceId,
            groupId: device.groupId,
          });
          break;
        case DeviceKind.AudioOutput:
          this.outputs.push({
            currentlyInUse: false,
            label: device.label,
            deviceId: device.deviceId,
            groupId: device.groupId,
          });
          break;
      }
    });
  }

}
