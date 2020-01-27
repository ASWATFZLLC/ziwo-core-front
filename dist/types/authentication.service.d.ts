import { ApiService } from './api/api.service';
/**
 * Credential provided by Ziwo
 * @email is the agent's email
 * @password is the agent's password
 */
export interface Credentials {
    email: string;
    password: string;
}
export declare class AuthenticationService {
    constructor();
    static authenticate(api: ApiService): Promise<any>;
}
