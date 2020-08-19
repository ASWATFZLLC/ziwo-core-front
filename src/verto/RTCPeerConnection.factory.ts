import {MediaChannel, MediaInfo} from '../media-channel';
import {Verto} from './verto';
import { HTMLMediaElementFactory } from './HTMLMediaElement.factory';

export class RTCPeerConnectionFactory {


  private static readonly STUN_ICE_SERVER = 'stun:stun.l.google.com:19302';

  /**
   * We initiate the call
   */
  public static outbound(verto:Verto, callId:string, login:string, phoneNumber:string):RTCPeerConnection {
    const rtcPeerConnection = new RTCPeerConnection({
      iceServers: [{urls: this.STUN_ICE_SERVER}],
    });
    rtcPeerConnection.ontrack = (tr:any) => {
      const track = tr.track;
      if (track.kind !== 'audio') {
        return;
      }
      const stream = new MediaStream();
      stream.addTrack(track);
      if (!verto.io.channel) {
        return;
      }
      verto.io.channel.remoteStream = stream;
      HTMLMediaElementFactory.push(verto.io, verto.tag, callId, 'peer').then(e => {
        e.srcObject = stream;
        return rtcPeerConnection;
      });
    };
    if (!verto.io.channel) {
      return rtcPeerConnection;
    }
    // Attach our media stream to the call's PeerConnection
    verto.io.channel.stream.getTracks().forEach((track:any) => {
      rtcPeerConnection.addTrack(track);
    });
    // We wait for candidate to be null to make sure all candidates have been processed
    // ! for unknown reason, gathering ice candidates on chrome while using a VPN is taking too long (up to 1 min)
    //   so we use a timeout to cancel process with if collecting takes too long
    let collectingDone = false;
    let collectTimeout:any;
    rtcPeerConnection.onicecandidate = (candidate:any) => {
      if (collectTimeout) {
        window.clearTimeout(collectTimeout);
      }
      if (collectingDone) {
        return;
      }
      if (!candidate.candidate) {
        verto.send(verto.params.startCall(
          verto.sessid,
          callId,
          login,
          phoneNumber,
          rtcPeerConnection.localDescription?.sdp as string)
        );
      } else {
        collectTimeout = window.setTimeout(() => {
          collectingDone = true;
          verto.send(verto.params.startCall(
            verto.sessid,
            callId,
            login,
            phoneNumber,
            rtcPeerConnection.localDescription?.sdp as string)
          );
        }, 1000);
      }
    };
    rtcPeerConnection.createOffer().then((offer:any) => {
      rtcPeerConnection.setLocalDescription(offer).then(() => {});
    });
    return rtcPeerConnection;
  }

  /**
   * We receive the call
   */
  public static inbound(verto:Verto, inboudParams:any):Promise<RTCPeerConnection> {
    return new Promise<RTCPeerConnection>((onRes, onErr) => {

      const rtcPeerConnection = new RTCPeerConnection({
        iceServers: [{urls: this.STUN_ICE_SERVER}],
      });
      rtcPeerConnection.ontrack = (tr:any) => {
        const track = tr.track;
        if (track.kind !== 'audio') {
          return;
        }
        const stream = new MediaStream();

        stream.addTrack(track);
        if (!verto.io.channel) {
          return;
        }
        verto.io.channel.remoteStream = stream;
        HTMLMediaElementFactory.push(verto.io, verto.tag, inboudParams.callID, 'peer').then(r => {
          r.srcObject = stream;
          onRes(rtcPeerConnection);
          return;
        });
      };


      if (!verto.io.channel) {
        onRes(rtcPeerConnection);
        return;
      }

      // Attach our media stream to the call's PeerConnection
      verto.io.channel.stream.getTracks().forEach((track:any) => {
        rtcPeerConnection.addTrack(track);
      });

      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'offer', sdp: inboudParams.sdp}))
        .then(() => {
          rtcPeerConnection.createAnswer().then(d => {
            rtcPeerConnection.setLocalDescription(d);
          });
        });

      onRes(rtcPeerConnection);
    });
  }

  public static recovering(verto:Verto, params:any, direction:'inbound'|'outbound'):Promise<RTCPeerConnection> {
    return this.inbound(verto, params);
  }

}
