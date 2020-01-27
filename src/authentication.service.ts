import {ApiService} from './api/api.service';

/**
 * Credential provided by Ziwo
 * @email is the agent's email
 * @password is the agent's password
 */
export interface Credentials {
  email:string;
  password:string;
}

export class AuthenticationService {

  constructor() {}

  public static async authenticate(api:ApiService):Promise<any> {
    api.get<any>(api.endpoints.authenticate).then(r => {
      console.log('log in success');
    }).catch(er => {
      console.log('Cannot log in > ', er);
    });
  }

}
