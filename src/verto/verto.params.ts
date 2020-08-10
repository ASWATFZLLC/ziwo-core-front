export enum VertoMethod {
  Login = 'login',
  ClientReady = 'verto.clientReady',
  Attach = 'verto.attach',
  Media = 'verto.media',
  Invite = 'verto.invite',
  Answer = 'verto.answer',
  Info = 'verto.info',
  Modify = 'verto.modify',
  Display = 'verto.display',
  Bye = 'verto.bye',
  Pickup = 'verto.pickup',
}

export enum VertoByeReason {
  NORMAL_CLEARING = 16,
  CALL_REJECTED = 21,
  ORIGINATOR_CANCEL = 487,
}

export enum VertoState {
  Hold = 'hold',
  Unhold = 'unhold',
  Purge = 'purge',
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

  public hangupCall(sessionId:string, callId:string, login:string, phoneNumber:string,
    reason:VertoByeReason = VertoByeReason.NORMAL_CLEARING):VertoMessage<any> {
    return this.wrap(VertoMethod.Bye, {
      cause: VertoByeReason[reason],
      causeCode: reason,
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public attach(sessionId:string, callId:string, login:string, phoneNumber:string, sdp:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Attach, {
      sdp: sdp,
      sessid: sessionId,
      dialogParams: this.dialogParams(callId, login, phoneNumber),
    });
  }

  public answerCall(sessionId:string|undefined, callId:string, login:string, phoneNumber:string, sdp:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Answer, {
        sdp: sdp,
        sessid: sessionId,
        dialogParams: this.dialogParams(callId, login, phoneNumber, 'Inbound Call')
    });
  }

  public setState(sessionId:string, callId:string, login:string, phoneNumber:string, state:VertoState):VertoMessage<any> {
    return this.wrap(VertoMethod.Modify, {
      action: state,
      dialogParams: this.dialogParams(callId, login, phoneNumber),
      sessid: sessionId,
    });
  }

  public transfer(sessionId:string, callId:string, login:string, phoneNumber:string, transferTo:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Modify, {
        action: 'transfer',
        destination: transferTo,
        dialogParams: this.dialogParams(callId, login, phoneNumber),
        sessid: sessionId,
    });
  }

  public dtfm(sessionId:string, callId:string, login:string, char:string):VertoMessage<any> {
    return this.wrap(VertoMethod.Info, {
      sessid: sessionId,
      dialogParams: {
        callID: callId,
        login: login,
        dtfm: char,
      }
    });
  }

  public getUuid():string {
    return VertoParams.getUuid();
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
