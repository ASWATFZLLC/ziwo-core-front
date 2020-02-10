import {MediaChannel, MediaInfo} from '../media-channel';
import {Verto} from './verto';

export class RTCPeerConnectionFactory {

  /**
   * We initiate the call
   */
  public static outbound(verto:Verto, callId:string, login:string, phoneNumber:string):RTCPeerConnection {
    const rtcPeerConnection = new RTCPeerConnection();

    rtcPeerConnection.ontrack = (tr:any) => {
      const track = tr.track;
      if (track.kind !== 'audio') {
        return;
      }
      const stream = new MediaStream();
      stream.addTrack(track);
      if (!verto.channel) {
        return;
      }
      verto.channel.remoteStream = stream;
      verto.tags.peerTag.srcObject = stream;
    };

    if (!verto.channel) {
      return rtcPeerConnection;
    }

    // Attach our media stream to the call's PeerConnection
    verto.channel.stream.getTracks().forEach((track:any) => {
      rtcPeerConnection.addTrack(track);
    });

    // We wait for candidate to be null to make sure all candidates have been processed
    rtcPeerConnection.onicecandidate = (candidate:any) => {
      if (!candidate.candidate) {
        verto.send(verto.params.startCall(
          verto.sessid,
          callId,
          login,
          phoneNumber,
          rtcPeerConnection.localDescription?.sdp as string)
        );
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
  public static inbound(verto:Verto, callId:string, login:string, inboudParams:any):Promise<RTCPeerConnection> {
    return new Promise<RTCPeerConnection>((onRes, onErr) => {

      const rtcPeerConnection = new RTCPeerConnection();
      rtcPeerConnection.ontrack = (tr:any) => {

        const track = tr.track;
        if (track.kind !== 'audio') {
          return;
        }

        const stream = new MediaStream();
        stream.addTrack(track);
        if (!verto.channel) {
          return;
        }

        verto.channel.remoteStream = stream;
        verto.tags.peerTag.srcObject = stream;
      };


      if (!verto.channel) {
        onRes(rtcPeerConnection);
        return;
      }

      // Attach our media stream to the call's PeerConnection
      verto.channel.stream.getTracks().forEach((track:any) => {
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

}
