import { MediaInfo } from './media-channel';
import { Verto } from './verto/verto';

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
  private readonly verto:Verto;

  constructor(tags:MediaInfo, verto:Verto) {
    this.verto = verto;
    this.tags = tags;
    this.load().then();
  }

  /**
   * set @input as default input for calls
   */
  public useInput(inputId:any): Promise<void> {
    return new Promise<void>((ok, err) => {
      navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: inputId}}}).then(
        (stream) => {
          this.verto.updateStream(stream);
          ok();
        }
      ).catch(e => err(e));
    });
  }

  /**
   * set @output as default output for calls
   */
  public useOutput(outputId:string): Promise<void> {
    return new Promise<void>((ok, err) => {
      (this.tags.peerTag as any).setSinkId(outputId).
      then(() => {
        ok();
      }).catch((e:any) => err(e));
    });
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
