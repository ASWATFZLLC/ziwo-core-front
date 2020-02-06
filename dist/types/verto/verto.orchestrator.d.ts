import { VertoMessage } from './verto.params';
import { ZiwoEvent } from '../events';
export declare class VertoOrchestrator {
    private readonly debug;
    constructor(debug: boolean);
    handleMessage(message: VertoMessage<any>): ZiwoEvent | undefined;
    private onClientReady;
    private onInvite;
    private onModify;
    private onBye;
}
