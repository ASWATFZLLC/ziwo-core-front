import { ApiService } from './api.service';
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
interface UserInfo extends User {
    ccLogin: number;
    ccPassword: number;
    liveInfo: any;
    liveCalls: any[];
    wrapUpTime: number;
    noAnswerDelayTime: any;
    noAnswerTimeout: any;
    roamingContactNumber: string;
    roamingTimeout: number;
}
interface Queue {
    announcementType: string;
    callerIDNumber: any | null;
    createdAt: string;
    deletedAt: string | null;
    id: number;
    image: string | null;
    language: string;
    maxWaitTime: number;
    moh: string;
    name: string;
    nonWorkingHoursDID: string;
    priority: number;
    status: string;
    strategyType: string;
    surveyRequired: boolean;
    timeslots: string;
    updatedAt: string;
    urgentMessage: any | null;
    waitTimeoutDID: string;
}
interface Number {
    beyondTimeslotsLinkData: any | null;
    beyondTimeslotsLinkType: any | null;
    createdAt: string;
    deletedAt: any | null;
    did: string;
    didCalled: string;
    didDisplay: string;
    id: number;
    linkData: string;
    linkType: string;
    status: string;
    length: number;
    timeslots: any[];
    updatedAt: string;
    urgentMessage: any | null;
}
interface WebRtcInfo {
    socket: string;
}
export interface AgentPosition {
    name: string;
    password: string;
    hostname: string;
}
export interface AgentInfo {
    userInfo: UserInfo;
    queues: Queue[];
    numbers: Number[];
    webRtc: WebRtcInfo;
    position: AgentPosition;
}
export declare class AuthenticationService {
    constructor();
    static authenticate(api: ApiService, credentials: Credentials): Promise<AgentInfo>;
    private static loginZiwo;
    private static autoLogin;
    private static initAgent;
    private static fetchAgentProfile;
    private static fetchListQueues;
    private static fetchListNumbers;
    private static fetchWebRTCConfig;
}
export {};
