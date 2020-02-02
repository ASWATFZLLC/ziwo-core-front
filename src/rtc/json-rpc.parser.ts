import {JsonRpcEventType} from './json-rpc.interfaces';

/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */

export class JsonRpcParser {

  public static parse(data:any):JsonRpcEventType {
    if (this.isLoggedIn(data)) {
      return JsonRpcEventType.LoggedIn;
    }
    return JsonRpcEventType.Unknown;
  }

  private static isLoggedIn(data:any):boolean {
    return data.id === 3;
  }

}
