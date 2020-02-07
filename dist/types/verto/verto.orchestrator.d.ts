import { VertoMessage } from './verto.params';
import { ZiwoEvent } from '../events';
import { Call } from '../call';
export declare class VertoOrchestrator {
    private readonly debug;
    constructor(debug: boolean);
    handleMessage(message: VertoMessage<any, any>, call: Call | undefined): ZiwoEvent | undefined;
    private onClientReady;
    private onMedia;
    private onInvite;
    private onModify;
    private onBye;
    /**
     * ensulteCallIsExisting makes sure the call is not undefined.
     * If it is undefined, throw a meaningful error message
     */
    private ensureCallIsExisting;
}
