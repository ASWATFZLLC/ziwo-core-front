# CHANGELOG

## V0.1

 * Implementation of Verto protocol
 * Management of UserMedia (microphone only)
 * Authentication on Ziwo (for Api & Websocket)
 * User can start a phone call
 * User can stop a phone call
 * User can hold a phone call
 * User can unhold a phone call
 * User can mute his microphone
 * User can unmute his microphone
 * Event system (Error, AgentConnected, IncomingCall, OutgoingCall)

## V0.2

 * Whole new Event system (see README#Usage#Events)
 * Event sent when new incoming phone call
 * User can answer a phone call
 * [MILESTONE] Complete flow for outbound call
 * [MILESTONE] Complete flow for inbound call
 * First tests implemented

## V0.3

 * Add new `io` service to manage input and output devices
 * Update all dependencies to latest version
 * More logs and stability
 * Include agent details in the connected event