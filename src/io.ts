import { MediaInfo, MediaChannel } from './media-channel';
import { Verto } from './verto/verto';

interface Device {
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

  public input?:Device;
  public output?:Device;
  public channel?:MediaChannel;
  public volume = 100;
  private stream:any;
  private inputs:Device[] = [];
  private outputs:Device[] = [];

  constructor() {
    this.load().then(e => {
      this.useInput(this.inputs[0]);
      this.useOutput(this.outputs[0]);
    });
  }

  public useInput(device:Device): void {
    this.input = device;
    navigator.mediaDevices.getUserMedia({
      audio: {deviceId: device.deviceId}
    }).then((stream) => {
      this.channel = new MediaChannel(stream);
    }).then().catch(() => console.warn('ERROR WHILE SETTING UP MIC.'));
  }

  public useOutput(device:Device): void {
    this.output = device;
  }

  /**
   * return all the available input medias
   */
  public getInputs(): Device[] {
    return this.inputs;
  }

  /**
   * return all the available output medias
   */
  public getOutputs(): Device[] {
    return this.outputs;
  }

  public setVolume(vol:number): void {
    if (vol < 0) {
      vol = 0;
    }
    if (vol > 100) {
      vol = 100;
    }
    this.volume = vol;
  }

  public load(): Promise<void> {
    return new Promise<void>((ok, err) => {
      let streamDone = false;
      let deviceDone = false;
      navigator.mediaDevices.getUserMedia({audio: true}).then(
        (stream) => {
          this.getStream(stream);
          streamDone = true;
          if (deviceDone) {
            ok();
          }
        },
      ).then(
        (devices) => {
          this.getDevices(devices);
          deviceDone = true;
          if (streamDone) {
            ok();
          }
        },
      ).catch();
      navigator.mediaDevices.enumerateDevices().then(
        (devices) => this.getDevices(devices),
      ).catch(e => err(e));
    });
  }

  private getStream(stream:any): void {
    this.stream = stream;
  }

  private getDevices(devices:any): void {
    if (!devices) {
      return;
    }
    this.inputs.splice(0, this.inputs.length);
    this.outputs.splice(0, this.outputs.length);
    devices.forEach((device:any) => {
      switch (device.kind) {
        case DeviceKind.VideoInput:
          // We do not do support video
          break;
        case DeviceKind.AudioInput:
          this.inputs.push({
            label: device.label,
            deviceId: device.deviceId,
            groupId: device.groupId,
          });
          break;
        case DeviceKind.AudioOutput:
          this.outputs.push({
            label: device.label,
            deviceId: device.deviceId,
            groupId: device.groupId,
          });
          break;
      }
    });
  }

}
