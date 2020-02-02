import {JsonRpcEventType, JsonRpcEvent} from './json-rpc.interfaces';

/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */

export class JsonRpcParser {

  public static parse(data:any):JsonRpcEvent {
    if (this.isLoggedIn(data)) {
      return {
        type: JsonRpcEventType.LoggedIn,
        payload: data,
      };
    }
    if (this.isOutgoingCall(data)) {
      return {
        type: JsonRpcEventType.OutgoingCall,
        payload: data,
      };
    }
    return {
      type: JsonRpcEventType.Unknown,
      payload: data
    };
  }

  private static isLoggedIn(data:any):boolean {
    return data.id === 3;
  }

  private static isOutgoingCall(data:any):boolean {
    return data.id === 4;
  }

}
