"use strict";
// import {VertoMessage, VertoMethod} from './verto.params';
/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
// export class VertoParser {
//   public static parse(data:VertoMessage<any>):VertoMessage<any> {
//     if (this.isLoggedIn(data)) {
//       return {
//         type: VertoEventType.LoggedIn,
//         raw: data,
//         payload: data.params,
//       };
//     }
//     if (this.isOutgoingCall(data)) {
//       return {
//         type: VertoEventType.OutgoingCall,
//         raw: data,
//         payload: data.result,
//       };
//     }
//     if (this.isMediaRequest(data)) {
//       return {
//         type: VertoEventType.MediaRequest,
//         raw: data,
//         payload: data.params,
//       };
//     }
//     return {
//       type: VertoEventType.Unknown,
//       raw: data,
//       payload: data
//     };
//   }
//   private static isLoggedIn(data:any):boolean {
//     return data.
//   }
//   private static isOutgoingCall(data:any):boolean {
//     return data.id === 4;
//   }
//   private static isMediaRequest(data:any):boolean {
//     return data.method === 'verto.media';
//   }
// }
//# sourceMappingURL=verto.parser.js.map