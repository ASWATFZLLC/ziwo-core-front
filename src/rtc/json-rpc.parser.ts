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
        payload: data.params,
      };
    }
    if (this.isOutgoingCall(data)) {
      return {
        type: JsonRpcEventType.OutgoingCall,
        payload: data.result,
      };
    }
    return {
      type: JsonRpcEventType.Unknown,
      payload: data
    };
  }

  private static isLoggedIn(data:any):boolean {
    return data.id === JsonRpcActionId.login;
  }

  private static isOutgoingCall(data:any):boolean {
    return data.id === JsonRpcActionId.invite;
  }

}
