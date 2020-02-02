import {ZiwoEvent, ZiwoEventType, ErrorCode} from '../events';
import {JsonRpcParser} from './json-rpc.parser';
import {AgentPosition} from '../authentication.service';
import {JsonRpcParams} from './json-rpc.params';
import {Call} from './call';
import {Channel} from './channel';

export enum ZiwoSocketEvent {
  LoggedIn = 'LoggedIn',
  CallCreated = 'CallCreated',
}

interface Credentials {
  login:string;
  passwd:string;
  sessid:string;
}

/**
 * JsonRpcClient provides useful functions to interact with the WebSocket using Verto Protocol
 *
 * Usage:
 *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
 *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
 *      .then(() => {
 *        this.login() // REQUIRED: log the agent into the web socket
 *        // You can now proceed with any requests
 *      });
 *
 */
export class JsonRpcClient {

  private sessid?:string;
  private position?:AgentPosition;
  private socket?:WebSocket;
  private pc:any;

  private listeners:Function[] = [];

  private readonly debug:boolean;
  private readonly ICE_SERVER = 'stun:stun.l.google.com:19302';

  constructor(debug?:boolean) {
    this.debug = debug || false;
  }

  /**
   * INITIALIZERS
   *
   * Following functions are used to setup the socket
   */

  /**
   * addListener allows to listener for incoming Socket Event
   */
  public addListener(call:Function):void {
    this.listeners.push(call);
  }

  /**
   * openSocket should be called directly after the constructor
   * It initializate the socket and set the handlers
   */
  public openSocket(socketUrl:string):Promise<void> {
    return new Promise<void>((onRes, onErr) => {
      this.socket = new WebSocket(socketUrl);
      this.socket.onclose = () => {
        if (this.debug) {
          console.warn('Socket closed');
        }
      };
      this.socket.onopen = () => {
        onRes();
      };
      this.socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (!this.isJsonRpcValid) {
            throw new Error('Invalid Incoming JSON RPC');
          }
          this.listeners.forEach(fn => fn(JsonRpcParser.parse(data)));
        } catch (err) {
          console.warn('Invalid Message', msg);
          // NOTE : not sure if we should throw an error here -- need live testing to enable/disable
          ZiwoEvent.emit(ZiwoEventType.Error, {
            code: ErrorCode.ProtocolError,
            message: err,
          });
        }
      };
    });
  }

  /**
   * REQUESTS
   *
   * Following functions send a request to the opened socket. They do not return the result of the request
   * Instead, you should use `addListener` and use the Socket events to follow the status of the request.
   */

  /**
   * login log the agent in the newly created socket
   */
  public login(agentPosition:AgentPosition):Promise<void> {
    this.position = agentPosition;
    return new Promise<void>((onRes, onErr) => {
      if (!this.socket) {
        return onErr();
      }
      this.sessid = JsonRpcParams.getUuid();
      this.send(JsonRpcParams.loginParams(this.sessid, agentPosition.name, agentPosition.password));
    });
  }

  /**
   * send a start call request
   */
  public startCall(phoneNumber:string, callId:string, channel:Channel):Call {
    console.log('start call');
    if (!channel.stream) {
      throw new Error('Error in User Media');
    }

    // Create Call and its PeerConnection
    const call = new Call(callId, new RTCPeerConnection({
      iceServers: [{urls: this.ICE_SERVER}],
    }));

    // Attach our media stream to the call's PeerConnection
    channel.stream.getTracks().forEach((track:any) => {
      call.rtcPeerConnection.addTrack(track);
    });

    // We wait for candidate to be null to make sure all candidates have been processed
    call.rtcPeerConnection.onicecandidate = (candidate) => {
      console.log('candidate ', candidate);
      if (!candidate.candidate) {
        this.send(JsonRpcParams.startCall(
          this.sessid,
          this.getLogin(),
          phoneNumber,
          call.rtcPeerConnection.localDescription?.sdp as string)
        );
      }
    };

    // ??
    call.rtcPeerConnection.ontrack = (event) => {
      console.log('on track > ', event);
    };

    // // When PeerConnection request a negotiation, start the Verto call
    call.rtcPeerConnection.onnegotiationneeded = () => {
      call.rtcPeerConnection.createOffer().then(offer => {
        call.rtcPeerConnection.setLocalDescription(offer).then(() => {});
      });
    };

    return call;
  }

  /**
   * PRIVATE Functions
   */

  /**
   * Send data to socket and log in case of debug
   */
  private send(data:any):void {
    if (this.debug) {
      console.log('Write message > ', data);
    }
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  /**
   * Validate the JSON RPC headers
   */
  private isJsonRpcValid(data:any):boolean {
    return typeof data === 'object'
      && 'jsonrpc' in data
      && data.jsonrpc === '2.0';
  }

  /**
   * Concat position to return the login used in Json RTC request
   */
  private getLogin():string {
    return `${this.position?.name}@${this.position?.hostname}`;
  }

}
