import {ApiService} from './api.service';
import {MESSAGES} from './messages';

/**
 * Credential provided by Ziwo
 * @email is the agent's email
 * @password is the agent's password
 */
export interface Credentials {
  /**
   * @email is the agent email
   * If not provided, please provide @authenticationToken
   */
  email:string;

  /**
   * @email is the agent password
   * If not provided, please provide @authenticationToken
   */
  password:string;

  /**
   * @authenticationToken is the token provided by the /login API
   * If not provided, please provide @authenticationToken
   */
  authenticationToken?:string;
}

enum UserStatus {
  Active = 'active',
}

enum UserType {
  Admin = 'admin',
}

enum UserProfileType {
  User = 'users'
}

export interface User {
  id:number;
  firstName:string;
  lastName:string;
  username:string;
  status:UserStatus;
  type:UserType;
  photo:string;
  roleId:number;
  lastLoginAt:string;
  contactNumber:null|string;
  createdAt:string;
  updatedAt:string;
  access_token:string;
  profileType:UserProfileType;
  role:any;
  roles:any;
}

interface UserInfo extends User {
  ccLogin:number;
  ccPassword:number;
  liveInfo:any;
  liveCalls:any[];
  wrapUpTime:number;
  noAnswerDelayTime:any;
  noAnswerTimeout:any;
  roamingContactNumber:string;
  roamingTimeout:number;
}

interface Queue {
  announcementType:string;
  callerIDNumber:any|null;
  ​createdAt:string;
  ​deletedAt:string|null;
  ​id:number;
  ​image:string|null;
  ​language:string;
  ​maxWaitTime:number;
  ​moh:string;
  ​name:string;
  ​nonWorkingHoursDID:string;
  ​priority:number;
  ​status:string;
  ​strategyType:string;
  ​surveyRequired:boolean;
  ​timeslots:string;
  ​updatedAt:string;
  ​urgentMessage:any|null;
  ​waitTimeoutDID:string;
}

interface Number {
  beyondTimeslotsLinkData:any|null;
  ​​beyondTimeslotsLinkType:any|null;
  ​​createdAt:string;
  ​​deletedAt:any|null;
  ​​did:string;
  ​​didCalled:string;
  ​​didDisplay:string;
  ​​id:number;
  ​​linkData:string;
  ​​linkType:string;
  ​​status:string;
  ​​length:number;
  ​​timeslots:any[];
  ​​updatedAt:string;
  ​​urgentMessage:any|null;
}

interface WebRtcInfo {
  port:string;
  protocol:string;
}

export interface AgentInfo {
  userInfo:UserInfo;
  queues:Queue[];
  numbers:Number[];
  webRtc:WebRtcInfo;
}


export class AuthenticationService {

  constructor() {}

  public static authenticate(api:ApiService, credentials:Credentials):Promise<AgentInfo> {
    if (credentials.authenticationToken) {
      api.setToken(credentials.authenticationToken);
      return new Promise<any>((onRes, onErr) => {
        this.initAgent(api).then(res => onRes(res)).catch(err => onErr(err));
      });
    }
    if (!credentials.email || !credentials.password) {
      throw new Error(MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
    }
    return new Promise<any>((onRes, onErr) => {
      this.loginZiwo(api, credentials.email, credentials.password).then(() => {
        this.initAgent(api).then(res => onRes(res)).catch(err => onErr(err));
      }).catch(err => onErr(err));
    });
  }

  private static loginZiwo(api:ApiService, email:string, password:string):Promise<User> {
    return new Promise<User>((onRes, onErr) => {
      api.post<User>(api.endpoints.authenticate, {
        username: email,
        password: password,
      }).then(r => {
        api.setToken(r.content.access_token);
        onRes(r.content);
      }).catch(e => {
        onErr(e);
      });
    });
  }

  private static initAgent(api:ApiService):Promise<AgentInfo> {
    return new Promise<AgentInfo>((onRes, onErr) => {
      Promise.all([
        this.fetchAgentProfile(api),
        this.fetchListQueues(api),
        this.fetchListNumbers(api),
        this.fetchWebRTCConfig(api),
      ]).then(res => {
        onRes({
          userInfo: res[0],
          queues: res[1] || [],
          numbers: res[2] || [],
          webRtc: res[3],
        });
      })
      .catch(err => onErr(err));
    });
  }

  private static fetchAgentProfile(api:ApiService):Promise<any> {
    return new Promise<any>((onRes, onErr) => {
      api.get(api.endpoints.profile).then(res => {
        onRes(res.content);
      }).catch(err => onErr(err));
    });
  }

  private static fetchListQueues(api:ApiService):Promise<any> {
    return new Promise<any>((onRes, onErr) => {
      api.get('/agents/channels/calls/listQueues').then(res => {
        onRes(res.content);
      }).catch(err => onErr(err));
    });
  }

  private static fetchListNumbers(api:ApiService):Promise<any> {
    return new Promise<any>((onRes, onErr) => {
      api.get('/agents/channels/calls/listNumbers').then(res => {
        onRes(res.content);
      }).catch(err => onErr(err));
    });
  }

  private static fetchWebRTCConfig(api:ApiService):Promise<any> {
    return new Promise<any>((onRes, onErr) => {
      api.get('/fs/webrtc/config').then(res => {
        onRes(res.content);
      }).catch(err => onErr(err));
    });
  }

}
