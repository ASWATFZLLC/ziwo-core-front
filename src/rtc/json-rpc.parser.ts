import {JsonRpcEventType, JsonRpcEvent} from './json-rpc.interfaces';
import {JsonRpcActionId} from './json-rpc.params';

/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */

export class JsonRpcParser {

  public static parse(data:any):JsonRpcEvent {
    if (this.isLoggedIn(data)) {
      return {
        type: JsonRpcEventType.LoggedIn,
        raw: data,
        payload: data.params,
      };
    }
    if (this.isOutgoingCall(data)) {
      return {
        type: JsonRpcEventType.OutgoingCall,
        raw: data,
        payload: data.result,
      };
    }
    if (this.isMediaRequest(data)) {
      return {
        type: JsonRpcEventType.MediaRequest,
        raw: data,
        payload: data.params,
      };
    }
    return {
      type: JsonRpcEventType.Unknown,
      raw: data,
      payload: data
    };
  }

  private static isLoggedIn(data:any):boolean {
    return data.id === JsonRpcActionId.login;
  }

  private static isOutgoingCall(data:any):boolean {
    return data.id === JsonRpcActionId.invite;
  }

  private static isMediaRequest(data:any):boolean {
    return data.method === 'verto.media';
  }

}
