/**
 * Credential provided by Ziwo
 * @email is the agent's email
 * @password is the agent's password
 * @centerName is the contact center name the agent is working for
 */
export interface Credentials {
    email: string;
    password: string;
    contactCenterName: string;
}
export declare class Authentication {
    constructor();
    static authenticate(): Promise<any>;
}
