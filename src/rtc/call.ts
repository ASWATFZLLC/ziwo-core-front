import {MediaChannel} from './media-channel';
import { JsonRpcClient } from './json-rpc';

/**
 * Call holds a call information and provide helpers
 */
export class Call {

  public readonly callId:string;
  public readonly rtcPeerConnection:RTCPeerConnection;
  public readonly channel:MediaChannel;
  public readonly jsonRpcClient:JsonRpcClient;
  public readonly phoneNumber:string;

  constructor(callId:string, jsonRpcClient:JsonRpcClient, rtcPeerConnection:RTCPeerConnection, channel:MediaChannel, phoneNumber:string) {
    this.jsonRpcClient = jsonRpcClient;
    this.callId = callId;
    this.rtcPeerConnection = rtcPeerConnection;
    this.channel = channel;
    this.phoneNumber = phoneNumber;
  }

  public answer():void {
    console.warn('Answer not implemented');
  }

  public hangup():void {
    console.warn('Hangup not implemented');
    this.jsonRpcClient.hangupCall(this.callId, this.phoneNumber);
  }

  public mute():void {
    console.warn('Mute not implemented');
  }

  public unmute():void {
    console.warn('Unmute not implemented');
  }

  public hold():void {
    console.warn('Hold not implemented');
  }

}
