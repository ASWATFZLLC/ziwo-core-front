import { IOService } from '../io';

export class HTMLMediaElementFactory {

  public static push(io:IOService, parent:HTMLDivElement, callId:string, type:'peer'|'self'): HTMLMediaElement {
    const t = document.createElement('video') as HTMLVideoElement;
    t.id = `media-${type}-${callId}`;
    t.setAttribute('playsinline', '');
    t.setAttribute('autoplay', '');
    t.dataset.callId = callId;
    t.dataset.type = type;
    this.attachSinkId(t, io.output?.deviceId as string);

    parent.appendChild(t);
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

  private static attachSinkId(element:any, destinationId:string): void {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(destinationId)
          .then(() => {
            console.log(`Success, audio output device attached: ${destinationId}`);
          })
          .catch((error:any) => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
          });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

}
