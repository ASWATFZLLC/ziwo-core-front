export enum VertoMethod {
  Login = 'login',
  ClientReady = 'verto.clientReady',
  Media = 'verto.media',
  Invite = 'verto.invite',
  Answer = 'verto.answer',
  Modify = 'verto.modify',
  Display = 'verto.display',
  Bye = 'verto.bye',
}

export enum VertoAction {
  Hold = 'hold',
  Unhold = 'unhold',
}

export enum VertoNotificationMessage {
  CallCreated = 'CALL CREATED',
  CallEnded = 'CALL ENDED',
}

export interface VertoMessage<T> {
  jsonrpc:'2.0';
  method:VertoMethod;
  id:number;
  params:T;
}

export interface VertoNotification<T> {
  jsonrpc:'2.0';
  method:VertoMethod;
  id:number;
  result:T;
}

export interface VertoLogin {}

export class VertoParams {

  private id = 0;

  public wrap(method:string, params:any = {}, id:number = -1):VertoMessage<any> {
    this.id += 1;
    return {
      jsonrpc: '2.0',
      method: method as VertoMethod,
      id: id > 0 ? id : this.id,
      params: params,
    };
  }

  public login(sessid:string, login:string, passwd:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Login, {
      sessid,
      login,
      passwd
    });
  }

  public startCall(sessionId:string|undefined, callId:string, login:string, phoneNumber:string, sdp:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Invite, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: this.dialogParams(callId, login, phoneNumber),
    });
  }

  public hangupCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Bye, {
      cause: 'NORMAL_CLEARING',
      causeCode: 16,
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public holdCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Modify, {
      action: 'hold',
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public unholdCall(sessionId:string, callId:string, login:string, phoneNumber:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Modify, {
      action: 'unhold',
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public answerCall(sessionId:string|undefined, callId:string, login:string, phoneNumber:string, sdp:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Answer, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: this.dialogParams(callId, login, phoneNumber, 'Inbound Call')
    });
  }

  public getUuid():string {
    /* tslint:disable */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    /* tslint:enable */
    });
  }

  private dialogParams(callId:string, login:string, phoneNumber:string, callName = 'Outbound Call'):any {
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
