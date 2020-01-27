import { ApiService } from './api/api.service';
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
    email: string;
    /**
     * @email is the agent password
     * If not provided, please provide @authenticationToken
     */
    password: string;
    /**
     * @authenticationToken is the token provided by the /login API
     * If not provided, please provide @authenticationToken
     */
    authenticationToken?: string;
}
declare enum UserStatus {
    Active = "active"
}
declare enum UserType {
    Admin = "admin"
}
declare enum UserProfileType {
    User = "users"
}
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    status: UserStatus;
    type: UserType;
    photo: string;
    roleId: number;
    lastLoginAt: string;
    contactNumber: null | string;
    createdAt: string;
    updatedAt: string;
    access_token: string;
    profileType: UserProfileType;
    role: any;
    roles: any;
}
export declare class AuthenticationService {
    constructor();
    static authenticate(api: ApiService, credentials: Credentials): Promise<any>;
    private static loginCallCenter;
    private static loginZiwo;
}
export {};
