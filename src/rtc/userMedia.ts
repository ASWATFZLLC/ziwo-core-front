import {Channel} from './channel';

export interface MediaRequested {
  audio?:boolean;
  video?:{
    selfTag:Element;
    peerTag:Element;
  };
}

export class UserMedia {

  public static getUserMedia(mediaRequested:UserMedia):Promise<Channel> {
    return new Promise<Channel>((onRes, onErr) => {
      try {
        navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
          onRes(new Channel(stream));
        });
      } catch (e) {
        onErr(e);
      }
    });
  }

}
