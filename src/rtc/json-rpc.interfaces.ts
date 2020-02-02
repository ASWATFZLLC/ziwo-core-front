
export interface JsonRpcEvent {
  type:JsonRpcEventType;
  payload:any; // should be casted into appropriate Interface based on the type
}

export enum JsonRpcEventType {
  Unknown = 'Unknown',
  LoggedIn = 'LoggedIn',
}

export interface LoggedInPayload {
  sessid:string;
}

export class JsonRpcBuilder {

  public static loggedIn(data:any):JsonRpcEvent {
    return {
      type: JsonRpcEventType.LoggedIn,
      payload: {
        sessid: data.result.id
      },
    };
  }

  public static unknown(data:any):JsonRpcEvent {
    return {
      type: JsonRpcEventType.Unknown,
      payload: data,
    };
  }

}
