
export class JsonRpcParams {

  public static loginParams(sessid:string, login:string, passwd:string):string {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'login',
      id: 3,
      params: {
        sessid,
        login,
        passwd,
      },
    });
  }

  public static startCall(sessionId:string|undefined, login:string, phoneNumber:string):string {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'verto.invite',
      id: 4,
      params: {
        sdp: 'a=candidate',
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
