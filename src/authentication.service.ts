import {ApiService, ApiResult, AsyncApiResult} from './api/api.service';
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

export class AuthenticationService {

  constructor() {}

  public static authenticate(api:ApiService, credentials:Credentials):Promise<any> {
    if (credentials.authenticationToken) {
      api.setToken(credentials.authenticationToken);
      return this.loginCallCenter(api);
    }
    if (!credentials.email || !credentials.password) {
      throw new Error(MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
    }
    return new Promise<any>((onRes, onErr) => {
      this.loginZiwo(api, credentials.email, credentials.password).then(() => {
        this.loginCallCenter(api).then(res => onRes(res)).catch(err => onErr(err));
      }).catch(err => onErr(err));
    });
  }

  private static loginCallCenter(api:ApiService):Promise<any> {
    return new Promise<any>((onRes, onErr) => {
      api.get(api.endpoints.profile).then(res => {
        console.log('Agent profile', res);
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

}
