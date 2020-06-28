
export class HTMLMediaElementFactory {

  public static push(parent:HTMLDivElement, callId:string, type:'peer'|'self'): HTMLMediaElement {
    const t = document.createElement('video') as HTMLMediaElement;
    t.id = `media-${type}-${callId}`;
    (t as any).playsinline = '';
    (t as any).autoplay = '';
    t.dataset.callId = callId;
    t.dataset.type = type;
    parent.appendChild(t);
    return t;
  }

  public static delete(parent:HTMLDivElement, callId:string): void {
    const toRemove:HTMLElement[] = [];
    let elIt:any;
    for (elIt in parent.children) {
      if ((elIt as HTMLElement).dataset.callId === callId) {
        toRemove.push(elIt);
      }
    }
    toRemove.forEach(e => e.remove());
  }

}
