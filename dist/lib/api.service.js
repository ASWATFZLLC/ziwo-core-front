"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ApiService provide functions for GET, POST, PUT and DELETE query
 *
 * Usage:
 *
 *  const apiService = new ApiService('kalvad-poc'); // contact center name you want to connect to
 *  apiService.get<User>(apiService.endpoints.authenticate) ; // ApiService already defined the endpoints available on Ziwo API
 *    .then( (e) => console.log('User > ', e.data)); // Request object is available under `data`;
 */
class ApiService {
    constructor(contactCenterName) {
        this.API_PROTOCOL = 'https://';
        this.API_PREFIX = '-api.aswat.co';
        this.contactCenterName = contactCenterName;
        this.baseUrl = `${this.API_PROTOCOL}${contactCenterName}${this.API_PREFIX}`;
        this.endpoints = {
            authenticate: `/auth/login`,
            profile: '/profile',
            autologin: '/agents/autoLogin',
        };
    }
    /**
     * Return the hostname of current user
     */
    getHostname() {
        return `${this.contactCenterName}${this.API_PREFIX}`;
    }
    /**
     * Set Authorization token for further requests
     */
    setToken(token) {
        this.token = token;
    }
    /**
     * Execute a GET query
     * @endpoint url endpoint. Base url should not be included
     */
    get(endpoint) {
        return this.query(endpoint + `?bc=${Date.now()}`, 'GET');
    }
    /**
     * Execute a POST query
     * @endpoint url endpoint. Base url should not be included
     */
    post(endpoint, payload) {
        return this.query(endpoint + `?bc=${Date.now()}`, 'POST', payload);
    }
    /**
     * Execute a PUT query
     * @endpoint url endpoint. Base url should not be included
     */
    put(endpoint, payload) {
        return this.query(endpoint + `?bc=${Date.now()}`, 'PUT', payload);
    }
    /**
     * Execute a DELETE query
     * @endpoint url endpoint. Base url should not be included
     */
    delete(endpoint) {
        return this.query(endpoint + `?bc=${Date.now()}`, 'DELETE');
    }
    query(endpoint, method, payload) {
        return new Promise((onRes, onErr) => {
            const fetchOptions = {
                method: method,
            };
            if (payload) {
                fetchOptions.body = JSON.stringify(payload);
            }
            window.fetch(`${this.baseUrl}${endpoint}`, {
                method: method,
                body: payload ? JSON.stringify(payload) : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': `${this.token}`,
                }
            }).then(res => {
                if (!res.ok) {
                    onErr(`Fetch error: ${res.statusText}`);
                    return;
                }
                onRes(res.json());
            }).catch(err => onErr(err));
        });
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map