import { ZiwoEvent } from '../events';
import { Call } from '../call';
/**
 * Verto Orchestrator can be seen as the core component of our Verto implemented
 * Its role is to read all incoming message and act appropriately:
 *  - broadcast important messages as ZiwoEvent (incoming call, call set on hold, call answered, ...)
 *  - run appropriate commands if required by verto protocol (bind stream on verto.mediaRequest, clear call if verto.callDestroyed, ...)
 */
export declare class VertoOrchestrator {
    private readonly debug;
    private readonly CALL_ENDED_NOTIFICATION;
    constructor(debug: boolean);
    /**
     * We can identify 2 types of inputs:
     *  - message (or request): contains a `method` and usually requires further actions
     *  - notication: does not contain a `method` and does not require further actions. Provide call's update (hold, unhold, ...)
     */
    onInput(message: any, call: Call | undefined): ZiwoEvent | undefined;
    private handleMessage;
    private handleNotification;
    private handleCallEnded;
    private onClientReady;
    /***
     *** MESSAGE SECTION
     ***/
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
    /***
     *** NOTIFICATION SECTION
     ***/
    private onHold;
    private onUnhold;
    /***
     *** OTHERS
     ***/
    /**
     * ensureCallIsExisting makes sure the call is not undefined.
     * If it is undefined, throw a meaningful error message
     */
    private ensureCallIsExisting;
    private pushState;
}
