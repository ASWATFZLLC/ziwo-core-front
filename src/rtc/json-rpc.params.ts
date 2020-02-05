export enum JsonRpcMethod {
  login = 'login',
  invite = 'verto.invite',
  bye = 'verto.bye',
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

  public static wrap(method:string, id:number = 0, params:any = {}):JsonRpcRequest<any> {
    return {
      jsonrpc: '2.0',
      method: method as JsonRpcMethod,
      id: id,
      params: params,
    };
  }

  public static login(sessid:string, login:string, passwd:string):JsonRpcRequest<any> {
    return this.wrap(JsonRpcMethod.login, 3, {
      sessid,
      login,
      passwd
    });
  }

  public static startCall(sessionId:string|undefined, callId:string, login:string, phoneNumber:string, sdp:string):JsonRpcRequest<any> {
    return this.wrap(JsonRpcMethod.invite, 4, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: {
          callID: callId,
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
  }

  public static hangupCall(sessionid:string, callId:string, login:string, phoneNumber:string):JsonRpcRequest<any> {
    return this.wrap(JsonRpcMethod.bye, 9, {
      cause: 'NORMAL_CLEARING',
      causeCode: 16,
      dialogParams: {
        callID: callId,
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
