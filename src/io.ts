import { MediaInfo, MediaChannel } from './media-channel';
import { Verto } from './verto/verto';
import { ZiwoEvent, ZiwoEventType, ZiwoErrorCode } from './events';

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
  public onDevicesUpdatedListeners:Function[] = [];

  constructor() {
    this.load().then(e => {
      if (this.inputs.length > 0) {
        this.useDefaultInput();
      } else {
        ZiwoEvent.error(ZiwoErrorCode.DevicesErrorNoInput, e);
      }
      if (this.outputs.length > 0) {
        this.useDefaultOutput();
      } else {
        ZiwoEvent.error(ZiwoErrorCode.DevicesErrorNoOutout, e);
      }
      this.emitDevicesUpdatedListeners(true, true);
    }).catch(e => {
      ZiwoEvent.error(ZiwoErrorCode.DevicesError, e);
    });
    this.listenForDevicesUpdate();
  }

  public onDevicesUpdated(fn:Function): void {
    this.onDevicesUpdatedListeners.push(fn);
  }

  public meetsRequirement(): boolean {
    return this.inputs.length > 0 && this.outputs.length > 0;
  }

  public useDefaultInput(): void {
    this.useInput(this.inputs[0], false);
  }

  public useDefaultOutput(): void {
    this.useOutput(this.outputs[0]);
  }

  public useInput(device:Device, withRetryIfFailed = true): void {
    try {
      this.input = device;
      navigator.mediaDevices.getUserMedia({
        audio: {deviceId: device.deviceId}
      }).then((stream) => {
        this.channel = new MediaChannel(stream);
      }).then().catch(() => console.warn('ERROR WHILE SETTING UP MIC.'));
    } catch {
      if (withRetryIfFailed) {
        this.useDefaultInput();
      }
    }
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
      let listDone = false;
      navigator.mediaDevices.getUserMedia({audio: true}).then(
        (stream) => {
          this.getStream(stream);
          streamDone = true;
          if (deviceDone && listDone) {
            ok();
          }
        },
      ).then(
        (devices) => {
          this.getDevices(devices);
          deviceDone = true;
          if (streamDone && listDone) {
            ok();
          }
        },
      ).catch();
      navigator.mediaDevices.enumerateDevices().then(
        (devices) => {
          this.getDevices(devices);
          listDone = true;
          if (streamDone && deviceDone) {
            ok();
          }
        }).catch(e => err(e));
    });
  }

  private emitDevicesUpdatedListeners(inputChanged:boolean, outputChanged:boolean): void {
    this.onDevicesUpdatedListeners.forEach(f => f(inputChanged, outputChanged));
  }

  private listenForDevicesUpdate(): void {
    if (!navigator || !navigator.mediaDevices) {
      return;
    }
    navigator.mediaDevices.ondevicechange = () => {
      this.load().then(() => {
        this.emitDevicesUpdatedListeners(this.onInputListUpdated(), this.onOutputlistUpdated());
      });
    };
  }

  private onInputListUpdated(): boolean {
    if (this.inputs.length === 0) {
      ZiwoEvent.error(ZiwoErrorCode.DevicesErrorNoInput, 'no input available');
      return false;
    }
    if (!this.input) {
      this.useDefaultInput();
      return true;
    }
    if (this.inputs.findIndex(i => i.deviceId === this.input?.deviceId) === -1) {
      // currently used device is not available anymore -
      this.useDefaultInput();
      return true;
    }
    return false;
  }

  private onOutputlistUpdated(): boolean {
    if (this.outputs.length === 0) {
      ZiwoEvent.error(ZiwoErrorCode.DevicesErrorNoOutout, 'no output available');
      return false;
    }
    if (!this.output) {
      this.useDefaultOutput();
      return true;
    }
    if (this.outputs.findIndex(o => o.deviceId === this.output?.deviceId) === -1) {
      // currently used device is not available anymore -
      this.useDefaultOutput();
      return true;
    }
    return false;
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
