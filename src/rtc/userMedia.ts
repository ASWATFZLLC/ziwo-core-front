import {MediaChannel} from './media-channel';

export interface MediaRequested {
  audio?:boolean;
  video?:{
    selfTag:Element;
    peerTag:Element;
  };
}

export class UserMedia {

  public static getUserMedia(mediaRequested:UserMedia):Promise<MediaChannel> {
    return new Promise<MediaChannel>((onRes, onErr) => {
      try {
        navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
          onRes(new MediaChannel(stream));
        });
      } catch (e) {
        onErr(e);
      }
    });
  }

}
