import { Verto } from './verto';
export declare class RTCPeerConnectionFactory {
    /**
     * We initiate the call
     */
    static outbound(verto: Verto, callId: string, login: string, phoneNumber: string): RTCPeerConnection;
    /**
     * We receive the call
     */
    static inbound(verto: Verto, callId: string, login: string, sdp: string): RTCPeerConnection;
}
