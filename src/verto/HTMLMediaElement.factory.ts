import { IOService } from '../io';

export class HTMLMediaElementFactory {

  public static async push(io:IOService, parent:HTMLDivElement, callId:string, type:'peer'|'self'): Promise<HTMLMediaElement> {
    const t = document.createElement('video') as HTMLVideoElement;
    t.id = `media-${type}-${callId}`;
    t.setAttribute('playsinline', '');
    t.setAttribute('autoplay', '');
    t.dataset.callId = callId;
    t.dataset.type = type;
    t.volume = io.volume / 100;

    parent.appendChild(t);
    window.setTimeout(() => {
      (t as any).setSinkId((io.output as any).deviceId)
      .then(() => {
        console.log(`Success, audio output device attached: ${io.output?.deviceId}`);
      })
      .catch((error:any) => {
        let errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
        }
        console.error(errorMessage);
      });
    }, 200);
    return t;
  }

  public static delete(parent:HTMLDivElement, callId:string): void {
    const toRemove:HTMLElement[] = [];
    for (let i = 0 ; i < parent.children.length ; i++) {
      const item = parent.children[i] as HTMLElement;
      if (item && item.dataset && item.dataset.callId === callId) {
        toRemove.push(item);
      }
    }
    toRemove.forEach(e => e.remove());
  }

}
