
export class HTMLMediaElementFactory {

  public static push(parent:HTMLDivElement, callId:string, type:'peer'|'self'): HTMLMediaElement {
    const t = document.createElement('video') as HTMLMediaElement;
    t.id = `media-${type}-${callId}`;
    t.setAttribute('playsinline', '');
    t.setAttribute('autoplay', '');
    t.dataset.callId = callId;
    t.dataset.type = type;
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

}
