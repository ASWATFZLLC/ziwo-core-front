import {VertoParams} from './verto.params';

export class VertoSession {

  private static readonly storageKey = 'ziwo_socket_session_id';

  /**
   * get will fetch local storage to retrieve existing SessionId
   * If no SessionId are found in storage, we generate a new one
   */
  public static get():string {
    const v = window.sessionStorage.getItem(this.storageKey);
    if (v) {
      return v;
    }
    const newId = VertoParams.getUuid();
    window.sessionStorage.setItem(this.storageKey, newId);
    return newId;
  }

}
