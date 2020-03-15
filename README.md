# Ziwo Core Front

Provides a Ziwo Client to perform call

Online documentation: http://core-front.ziwo.io/

## Get started

Take time to read the following links:
  1. `Usage` section of this file
  2. `Events` section of this file
  3. Ziwo Client class http://core-front.ziwo.io/classes/ziwoclient.html
  4. Call class http://core-front.ziwo.io/classes/call.html
  5. Event's details: http://core-front.ziwo.io/classes/ziwoevent.html)

### Usage

You can easily instanciate a Ziwo Client:

```ts
ziwoClient = new ziwoCoreFront.ZiwoClient({
    autoConnect: true, // Automatically connect agent to contact center. Default is true
    contactCenterName: 'your-contact-center-name', // Contact center you are trying to connect to
    credentials: { // User's credentials. You can either send an authentication token or directly the user's credentials
        authenticationToken: 'token_returned_on_login_action',
        //// If you don't have an authentication token, simply provide user's credentials
        // email: 'toto@hello.org',
        // password: 'verysecretpassword',
    },
    tags: { // HTML tags of <video> elements available in your DOM
        selfTag: document.getElementById('self-video'), // `selfTag` is not required if you don't use video
        peerTag: document.getElementById('peer-video'), // `peerTag` is mandatory. It is used to bind the incoming stream (audio or video)
    },
    debug: true, // Will provide additional logs as well as displaying incoming/outgoing Verto messages
});

```
*If you disabled the auto connect in the option, make sure to call `connect()` before anything else.*

Now, you can use the only function available in the Ziwo Client : startCall
```ts
ziwoClient.startCall('+3364208xxxx');
```

Everything else is managed through the events.

### Events

The events emitted by Ziwo will allow you to perform many actions. Each event holds a Call instance that you can use to change the status of the call.

See below the list of events:

| Events       | Description                                                                             |
| ------------ | --------------------------------------------------------------------------------------- |
| error        | Something wrong happened. See details for further information                           |
| connected    | User has been successfully authenticated                                                |
| disconnected | User has been disconnected                                                              |
| requesting   | Requesting operator to make the call                                                    |
| trying       | Operator trying to make the call                                                        |
| early        | Call is waiting for customer to pick up                                                 |
| ringing      | Call is ringing agent phone                                                             |
| answering    | Agent is answering call                                                                 |
| active       | Agent and customer can talk to each other                                               |
| held         | Customer has been put on hold by the Agent                                              |
| hangup       | Call is being hanged up                                                                 |
| mute         | Call has been muted by the agent                                                        |
| unmute       | Call has been unmuted by the agent                                                      |
| destroy      | Call is destroying                                                                      |
| recovering   | When reconnecting to virtual phone and a call wasn't over, it automatically recovers it |

For retro-compability reason, events are emitted with 2 formats:
 - `jorel-dialog-state-{EVENT_NAME}` (ex: jorel-dialog-state-held)
 - `ziwo-{EVENT_NAME}` (ex: ziwo-held)

You can use `addEventListener` to listen for ziwo event. Here is how you could simply answer an incoming call.

```ts
// Automatically answer incoming call
window.addEventListener('ziwo-ringing', (ev) => {
    // ev holds an instance of the Call in its details
    ev.details.call.answer();
});
```

Read http://core-front.ziwo.io/classes/ziwoevent.html) for more details

## Commands

| Command        | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| build          | Build the library into `/dist`                                                             |
| start          | Start the library in watch mode                                                            |
| start:app      | Start the demo application                                                                 |
| start:app:port | Start the demo application on a specific port. Usage: `$ PORT=1818 npm run start:app:port` |
| lint           | Run tslint                                                                                 |
| test           | Run the unit tests                                                                         |
| test:coverage  | Display a test coverage report                                                             |
| doc            | Build the documentation                                                                    |
| open:doc       | Open the documentation                                                                     |

## Contributing

1. Fork it (<https://github.com/ASWATFZLLC/ziwo-core-front/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

### Coding standards

#### Styles

DO:
1. Use 2 space per indentation
2. Use Single Quote only `'`
3. Surround loop and conditional bodies with curly braces. Statements on same line are allow to omit braces
4. Commas `,`, colons `:` and semi-colons `;` are followed by a single space
5. End of statement must be followed by semi-colons `;`

DO NOT:
1. Do not use `var` to declare variable. Instead use `const` or `let`
2. Do not use `<type>myVar` for casting. Instead use `as` keyword
3. Do not declare multiple variables with a single variable statement (`let x = 1, y = 2` is forbidden)
4. Do not use anonymous functions. Instead use arrow functions
5. Do not include white spaces in import

#### Files & Declaration

DO:
1. 1 file per logical component

DO NOT:
2. Do not export type/functions/interface/class unless you need to share it across multiple components

#### Names

DO:
1. Use PascalCase for type names
2. Use PascalCase for enum values
3. Use camelCase for function names
4. Use camelCase for property name and local variables
5. Use whole words when possible. One letter variable names are only allowed in arrow functions

DO NOT:
1. Do not use `_` for private properties
2. Do not use `I` as a prefix for interface names

#### Types

DO:
1. Variable must all be typed. Type may be omitted if the variable is assigned in the same statement
2. Function must all have a return type (even `void`)

DO NOT:
1. Do not use anonymous types. Instead use `Interface`
2. Do not use `'x'|'y`' as type. Instead use `Enum`
3. Do not include white space before nor after semicolor of type definition
4. Avoid using type `any`

#### Classes

DO:
1. Always add function visibility (`public`/`private`/`protected`)
2. Always add property visibility (`public`/`private`/`protected`)
3. Break the constructor into multiple line in order to keep 1 injection per line
4. Declare all the properties before the constructor
5. Declare all the functions after the constructor
6. Public properties must be declared before private ones
7. Public functions must be declared before private ones
