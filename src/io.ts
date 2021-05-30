import { MediaInfo, MediaChannel } from './media-channel';
import { Verto } from './verto/verto';
import { ZiwoEvent, ZiwoEventType, ZiwoErrorCode } from './events';
import { Call } from './call';

export interface Device {
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
  public volume = 100;
  // public channel?:MediaChannel;
  private inputs:Device[] = [];
  private outputs:Device[] = [];
  private calls:Call[];
  public onDevicesUpdatedListeners:Function[] = [];

  constructor(calls:Call[]) {
    this.calls = calls;
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

  public async getChannel(): Promise<MediaChannel|undefined> {
    return new Promise<MediaChannel|undefined>((onRes, onErr) => {
      if (!this.input) {
        if (this.inputs && this.inputs.length > 0) {
          this.useDefaultInput();
        } else {
          onRes(undefined);
        }
      }
      navigator.mediaDevices.getUserMedia({
        audio: {deviceId: (this.input as any).deviceId}
      }).then((stream) => {
        onRes(new MediaChannel(stream));
      }).then().catch(() => {
        onRes(undefined);
      });
    });
  }

  public async useInput(device:Device, withRetryIfFailed = true): Promise<void> {
    this.input = device;
    ZiwoEvent.emit(ZiwoEventType.InputChanged, {device: device});
    const channel = await this.getChannel();
    this.calls.forEach(c => {
      try {
        c.rtcPeerConnection.getSenders().forEach(sender => {
          if (sender.track && sender.track.kind === 'audio') {
            sender.replaceTrack(channel?.stream.getAudioTracks()[0]);
          }
        });
        if (channel) {
          c.channel = channel;
        }
      } catch {
        console.warn(`fail to input rebind for ${c.callId}`);
      }
    });
  }

  public async useOutput(device:Device): Promise<void> {
    this.output = device;
    ZiwoEvent.emit(ZiwoEventType.OutputChanged, {device: device});
    window.setTimeout(() => {
      this.calls.forEach(c => {
        try {
          const t = document.getElementById(`media-peer-${c.callId}`);
          (t as any).setSinkId((this.output as any).deviceId)
          .then(() => {
            console.log(`Success, audio output device attached: ${this.output?.deviceId}`);
          })
          .catch((error:any) => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
          });
        } catch {
          console.warn(`fail to output rebind for ${c.callId}`);
        }
      });
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
      navigator.mediaDevices.enumerateDevices().then(
        (devices) => {
          this.getDevices(devices);
          ok();
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
