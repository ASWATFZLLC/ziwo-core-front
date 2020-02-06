export enum VertoMethod {
  login = 'login',
  invite = 'verto.invite',
  modify = 'verto.modify',
  bye = 'verto.bye',
}

export interface VertoMessage<T> {
  jsonrpc:'2.0';
  method:VertoMethod;
  id:number;
  params:T;
}

export class VertoParams {

  public static wrap(method:string, id:number = 0, params:any = {}):VertoMessage<any> {
    return {
      jsonrpc: '2.0',
      method: method as VertoMethod,
      id: id,
      params: params,
    };
  }

  public static login(sessid:string, login:string, passwd:string):VertoMessage<any> {
    return this.wrap(VertoMethod.login, 3, {
      sessid,
      login,
      passwd
    });
  }

  public static startCall(sessionId:string|undefined, callId:string, login:string, phoneNumber:string, sdp:string):VertoMessage<any> {
    return this.wrap(VertoMethod.invite, 4, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: this.dialogParams(callId, login, phoneNumber),
    });
  }

  public static hangupCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.bye, 9, {
      cause: 'NORMAL_CLEARING',
      causeCode: 16,
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public static holdCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.modify, 11, {
      action: 'hold',
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public static unholdCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.modify, 10, {
      action: 'unhold',
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
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

  private static dialogParams(callId:string, login:string, phoneNumber:string):any {
    return {
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
    };
  }

}
