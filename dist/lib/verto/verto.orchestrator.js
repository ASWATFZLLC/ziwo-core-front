"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verto_params_1 = require("./verto.params");
const events_1 = require("../events");
const call_1 = require("../call");
const RTCPeerConnection_factory_1 = require("./RTCPeerConnection.factory");
/**
 * Verto Orchestrator can be seen as the core component of our Verto implemented
 * Its role is to read all incoming message and act appropriately:
 *  - broadcast important messages as ZiwoEvent (incoming call, call set on hold, call answered, ...)
 *  - run appropriate commands if required by verto protocol (bind stream on verto.mediaRequest, clear call if verto.callDestroyed, ...)
 */
class VertoOrchestrator {
    constructor(verto, debug) {
        this.debug = debug;
        this.verto = verto;
    }
    /**
     * We can identify 2 types of inputs:
     *  - message (or request): contains a `method` and usually requires further actions
     *  - notication: does not contain a `method` and does not require further actions. Provide call's update (hold, unhold, ...)
     */
    onInput(message, call) {
        return message.method ? this.handleMessage(message, call) : this.handleNotification(message, call);
    }
    handleMessage(message, call) {
        if (this.debug) {
            console.log('Incoming message ', message);
        }
        switch (message.method) {
            case verto_params_1.VertoMethod.ClientReady:
                return this.onClientReady(message);
            case verto_params_1.VertoMethod.Media:
                return !this.ensureCallIsExisting(call) ? undefined
                    : this.onMedia(message, call);
            case verto_params_1.VertoMethod.Invite:
                this.pushState(call, events_1.ZiwoEventType.Trying);
                return this.onInvite(message);
            case verto_params_1.VertoMethod.Answer:
                this.pushState(call, events_1.ZiwoEventType.Answering);
                return !this.ensureCallIsExisting(call) ? undefined
                    : this.onAnswer(message, call);
            case verto_params_1.VertoMethod.Display:
                if (this.ensureCallIsExisting(call)) {
                    call.pushState(events_1.ZiwoEventType.Active);
                }
                break;
            case verto_params_1.VertoMethod.Bye:
                if (this.ensureCallIsExisting(call)) {
                    call.pushState(events_1.ZiwoEventType.Hangup);
                }
        }
        return undefined;
    }
    handleNotification(message, call) {
        if (this.debug) {
            console.log('Incoming notification ', message);
        }
        if (message.result && message.result.message) {
            switch (message.result.message) {
                case verto_params_1.VertoNotificationMessage.CallCreated:
                    if (this.ensureCallIsExisting(call)) {
                        call.pushState(events_1.ZiwoEventType.Early);
                    }
                    break;
                case verto_params_1.VertoNotificationMessage.CallEnded:
                    if (this.ensureCallIsExisting(call)) {
                        call.pushState(events_1.ZiwoEventType.Hangup);
                    }
            }
        }
        if (message.result && message.result.action) {
            switch (message.result.action) {
                case verto_params_1.VertoAction.Hold:
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onHold(call);
                case verto_params_1.VertoAction.Unhold:
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onUnhold(call);
            }
        }
        return undefined;
    }
    onClientReady(message) {
        events_1.ZiwoEvent.emit(events_1.ZiwoEventType.Connected, {});
    }
    /***
     *** MESSAGE SECTION
     ***/
    /**
     * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
     * It should be transparent to users. No need to broadcast the event
     */
    onMedia(message, call) {
        call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.params.sdp }))
            .then(() => {
            if (this.debug) {
                console.log('Remote media connected');
            }
            call.pushState(events_1.ZiwoEventType.Active);
        }).catch(() => {
            if (this.debug) {
                console.warn('fail to attach remote media');
            }
        });
    }
    onInvite(message) {
        RTCPeerConnection_factory_1.RTCPeerConnectionFactory
            .inbound(this.verto, message.params.callID, this.verto.getLogin(), message.params)
            .then(pc => {
            const call = new call_1.Call(message.params.callID, this.verto, message.params.verto_h_originalCallerIdNumber, this.verto.getLogin(), pc, 'inbound', message.params);
            this.verto.calls.push(call);
            call.pushState(events_1.ZiwoEventType.Ringing);
        });
    }
    /**
     * Call has been answered by remote. Broadcast the event
     */
    onAnswer(message, call) {
        call.pushState(events_1.ZiwoEventType.Answering);
    }
    /***
     *** NOTIFICATION SECTION
     ***/
    onHold(call) {
        call.pushState(events_1.ZiwoEventType.Held);
    }
    onUnhold(call) {
        call.pushState(events_1.ZiwoEventType.Active);
    }
    /***
     *** OTHERS
     ***/
    /**
     * ensureCallIsExisting makes sure the call is not undefined.
     * If it is undefined, throw a meaningful error message
     */
    ensureCallIsExisting(call) {
        if (!call) {
            events_1.ZiwoEvent.error(events_1.ZiwoErrorCode.MissingCall, 'Received event from unknown callID');
            return false;
        }
        return true;
    }
    pushState(call, state) {
        if (call) {
            call.pushState(state);
        }
    }
}
exports.VertoOrchestrator = VertoOrchestrator;
//# sourceMappingURL=verto.orchestrator.js.map