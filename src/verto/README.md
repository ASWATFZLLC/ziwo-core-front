# Verto documentation

This document provides a listing and description of all incoming/outgoing messages used in Verto Protocol.

## Protocol

Verto must follow the JSON RPC specification. We can identify 2 type of input. `Message` and `Notification`.

**Message** always have a `method` defined and a `params` property. They are used to initiate an action: start a call, connect a user, stop a call.

```ts
interface VertoMessage<T> {
  jsonrpc:'2.0';        // Required
  method:VertoMethod;   // Define the purpose of the message
  id:number;            // Unique number used to associate request and response
  params:T;             // Payload vary depending on the Verto Method.
}
```

**Notification** only provides an update regarding the status of a call

```ts
interface VertoNotification<T> {
  jsonrpc:'2.0';        // Required
  id:number;            // Unique number used to associate request and response
  result:T;             // Payload vary depending on the Verto Method.
}
```

## Setup

This part is the flow required to setup the communication. It needs to be executed only once.
Once the flow is sucessfully executed, you are able to write or receive call's related messages.

 1. First `login` the user over the socket:
```typescript
interface VertoMessage<Login> {
  jsonrpc:'2.0';
  method:'login';
  id:number;
  params:{
    sessid:string;  // Session ID - UID generated
    login:string;   // User login
    passwd:string;  // User password
  }
}
```

 2. You should first receive a log in confirmation as a notification:
```typescript
interface VertoNotification<LoggedIn> {
  jsonrpc:'2.0';
  id:number;
  result: {
      message:'logged in';
      sessid:string;    // The session ID you previously generated
  }
}
```

 3. Without any further action from your side, you will then receive a Client Ready message:
```typescript
interface VertoMessage<ClientReady> {
  jsonrpc:'2.0';
  method:'verto.clientReady';
  id:number;
  params:{
    reattached_session:any[];   // ??
  }
}
```

At this point you are successfully logged in and ready to process actions.

## Call

This part list all possible message exchanged over the Verto protocol

**Message VS Notification**: carefully read the `Protocol` section to understand the difference between Message & Notification.

### Outgoing



### Incoming
