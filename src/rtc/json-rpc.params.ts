export enum JsonRpcMethod {
  login = 'login',
  invite = 'verto.invite',
}

export enum JsonRpcActionId {
  login = 3,
  invite = 4,
}

export interface JsonRpcRequest<T> {
  jsonrpc:'2.0';
  method:JsonRpcMethod;
  id:number;
  params:T;
}

export class JsonRpcParams {

  public static wrapParams(method:string, id:number = 0, params:any = {}):JsonRpcRequest<any> {
    return {
      jsonrpc: '2.0',
      method: method as JsonRpcMethod,
      id: id,
      params: params,
    };
  }

  public static loginParams(sessid:string, login:string, passwd:string):JsonRpcRequest<any> {
    return this.wrapParams(JsonRpcMethod.login, 3, {
      sessid,
      login,
      passwd
    });
  }

  public static startCall(sessionId:string|undefined, login:string, phoneNumber:string, sdp:string):JsonRpcRequest<any> {
    return this.wrapParams(JsonRpcMethod.invite, 4, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: {
          callID: this.getUuid(),
          caller_id_name: '',
          caller_id_number: '',
          dedEnc: false,
          destination_number: phoneNumber,
          incomingBandwidth: 'default',
          localTag: null,
          login: login,
          outgoingBandwidth: 'default',
          remote_caller_id_name: 'Outbound Call',
          remote_caller_id_number: phoneNumber,
          screenShare: false,
          tag: this.getUuid(),
          useCamera: false,
          useMic: true,
          useSpeak: true,
          useStereo: true,
          useVideo: undefined,
          videoParams: {},
          audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false
          },
        }
    });
    return {
      jsonrpc: '2.0',
      method: JsonRpcMethod.invite,
      id: 4,
      params: {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: {
          callID: this.getUuid(),
          tag: this.getUuid(),
          destination_number: phoneNumber,
          login: login,
          useStereo: true,
          screenShare: false,
          useMic: true,
          useSpeak: true,
          dedEnd: false,
          videoParams: {},
          audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false
          },
          caller_id_name: '',
          caller_id_number: '',
          outgoingBandwidth: 'default',
          incomingBandwidth: 'default',
          remote_caller_id_name: 'Outbound Call',
          remote_caller_id_number: phoneNumber,
        }
      },
    };
  }



  public static getUuid():string {
    /* tslint:disable */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    /* tslint:enable */
    });
  }

}
