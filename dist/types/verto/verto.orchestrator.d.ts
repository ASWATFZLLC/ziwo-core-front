import { VertoMessage } from './verto.params';
import { ZiwoEvent } from '../events';
import { Call } from '../call';
export declare class VertoOrchestrator {
    private readonly debug;
    constructor(debug: boolean);
    handleMessage(message: VertoMessage<any, any>, call: Call | undefined): ZiwoEvent | undefined;
    private onClientReady;
    /**
     * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
     * It should be transparent to users. No need to broadcast the event
     */
    private onMedia;
    private onInvite;
    /**
     * Call has been answered by remote. Broadcast the event
     */
    private onAnswer;
    private onModify;
    private onBye;
    /**
     * ensulteCallIsExisting makes sure the call is not undefined.
     * If it is undefined, throw a meaningful error message
     */
    private ensureCallIsExisting;
    private pushState;
}
