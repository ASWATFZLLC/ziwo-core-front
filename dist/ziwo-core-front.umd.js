(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ziwoCoreFront = {}));
}(this, (function (exports) { 'use strict';

    var Md5 = /** @class */ (function () {
        function Md5() {
        }
        Md5.AddUnsigned = function (lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (!!(lX4 & lY4)) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (!!(lX4 | lY4)) {
                if (!!(lResult & 0x40000000)) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                }
                else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            }
            else {
                return (lResult ^ lX8 ^ lY8);
            }
        };
        Md5.FF = function (a, b, c, d, x, s, ac) {
            a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));
            return this.AddUnsigned(this.RotateLeft(a, s), b);
        };
        Md5.GG = function (a, b, c, d, x, s, ac) {
            a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));
            return this.AddUnsigned(this.RotateLeft(a, s), b);
        };
        Md5.HH = function (a, b, c, d, x, s, ac) {
            a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));
            return this.AddUnsigned(this.RotateLeft(a, s), b);
        };
        Md5.II = function (a, b, c, d, x, s, ac) {
            a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));
            return this.AddUnsigned(this.RotateLeft(a, s), b);
        };
        Md5.ConvertToWordArray = function (string) {
            var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64, lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16, lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        Md5.WordToHex = function (lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };
        Md5.Utf8Encode = function (string) {
            var utftext = "", c;
            string = string.replace(/\r\n/g, "\n");
            for (var n = 0; n < string.length; n++) {
                c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        Md5.init = function (string) {
            var temp;
            if (typeof string !== 'string')
                string = JSON.stringify(string);
            this._string = this.Utf8Encode(string);
            this.x = this.ConvertToWordArray(this._string);
            this.a = 0x67452301;
            this.b = 0xEFCDAB89;
            this.c = 0x98BADCFE;
            this.d = 0x10325476;
            for (this.k = 0; this.k < this.x.length; this.k += 16) {
                this.AA = this.a;
                this.BB = this.b;
                this.CC = this.c;
                this.DD = this.d;
                this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);
                this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);
                this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);
                this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);
                this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);
                this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);
                this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);
                this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);
                this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);
                this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);
                this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);
                this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);
                this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);
                this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);
                this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);
                this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);
                this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);
                this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);
                this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);
                this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);
                this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);
                this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);
                this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);
                this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);
                this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);
                this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);
                this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);
                this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);
                this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);
                this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);
                this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);
                this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);
                this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);
                this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);
                this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);
                this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);
                this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);
                this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);
                this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);
                this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);
                this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);
                this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);
                this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);
                this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);
                this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);
                this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);
                this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);
                this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);
                this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);
                this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);
                this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);
                this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);
                this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);
                this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);
                this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);
                this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);
                this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);
                this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);
                this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);
                this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);
                this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);
                this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);
                this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);
                this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);
                this.a = this.AddUnsigned(this.a, this.AA);
                this.b = this.AddUnsigned(this.b, this.BB);
                this.c = this.AddUnsigned(this.c, this.CC);
                this.d = this.AddUnsigned(this.d, this.DD);
            }
            temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);
            return temp.toLowerCase();
        };
        Md5.x = Array();
        Md5.S11 = 7;
        Md5.S12 = 12;
        Md5.S13 = 17;
        Md5.S14 = 22;
        Md5.S21 = 5;
        Md5.S22 = 9;
        Md5.S23 = 14;
        Md5.S24 = 20;
        Md5.S31 = 4;
        Md5.S32 = 11;
        Md5.S33 = 16;
        Md5.S34 = 23;
        Md5.S41 = 6;
        Md5.S42 = 10;
        Md5.S43 = 15;
        Md5.S44 = 21;
        Md5.RotateLeft = function (lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); };
        Md5.F = function (x, y, z) { return (x & y) | ((~x) & z); };
        Md5.G = function (x, y, z) { return (x & z) | (y & (~z)); };
        Md5.H = function (x, y, z) { return (x ^ y ^ z); };
        Md5.I = function (x, y, z) { return (y ^ (x | (~z))); };
        return Md5;
    }());
    //# sourceMappingURL=index.js.map

    const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
    const MESSAGES = {
        EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`,
        INVALID_PHONE_NUMBER: (phoneNumber) => `${phoneNumber} is not a valid phone number`,
        AGENT_NOT_CONNECTED: (action) => `Agent is not connected. Cannot proceed '${action}'`,
        MEDIA_ERROR: `${MESSAGE_PREFIX}User media are not available`,
    };
    //# sourceMappingURL=messages.js.map

    var UserStatus;
    (function (UserStatus) {
        UserStatus["Active"] = "active";
    })(UserStatus || (UserStatus = {}));
    var UserType;
    (function (UserType) {
        UserType["Admin"] = "admin";
    })(UserType || (UserType = {}));
    var UserProfileType;
    (function (UserProfileType) {
        UserProfileType["User"] = "users";
    })(UserProfileType || (UserProfileType = {}));
    class AuthenticationService {
        constructor() { }
        static authenticate(api, credentials) {
            if (credentials.authenticationToken) {
                api.setToken(credentials.authenticationToken);
                return new Promise((onRes, onErr) => {
                    Promise.all([
                        this.initAgent(api),
                        this.autoLogin(api),
                    ]).then(res => onRes(res[0])).catch(err => onErr(err));
                });
            }
            if (!credentials.email || !credentials.password) {
                throw new Error(MESSAGES.EMAIL_PASSWORD_AUTHTOKEN_MISSING);
            }
            return new Promise((onRes, onErr) => {
                this.loginZiwo(api, credentials.email, credentials.password).then(() => {
                    Promise.all([
                        this.initAgent(api),
                        this.autoLogin(api),
                    ]).then(res => {
                        onRes(res[0]);
                    }).catch(err => onErr(err));
                }).catch(err => onErr(err));
            });
        }
        static loginZiwo(api, email, password) {
            return new Promise((onRes, onErr) => {
                api.post(api.endpoints.authenticate, {
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
        static autoLogin(api) {
            return api.put('/agents/autologin', {});
        }
        static initAgent(api) {
            return new Promise((onRes, onErr) => {
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
                        webRtc: {
                            socket: `${res[3].webSocket.protocol}://${api.getHostname()}:${res[3].webSocket.port}`,
                        },
                        position: {
                            name: `agent-${res[0].ccLogin}`,
                            password: Md5.init(`${res[0].ccLogin}${res[0].ccPassword}`).toString(),
                            hostname: api.getHostname(),
                        }
                    });
                })
                    .catch(err => onErr(err));
            });
        }
        static fetchAgentProfile(api) {
            return new Promise((onRes, onErr) => {
                api.get(api.endpoints.profile).then(res => {
                    onRes(res.content);
                }).catch(err => onErr(err));
            });
        }
        static fetchListQueues(api) {
            return new Promise((onRes, onErr) => {
                api.get('/agents/channels/calls/listQueues').then(res => {
                    onRes(res.content);
                }).catch(err => onErr(err));
            });
        }
        static fetchListNumbers(api) {
            return new Promise((onRes, onErr) => {
                api.get('/agents/channels/calls/listNumbers').then(res => {
                    onRes(res.content);
                }).catch(err => onErr(err));
            });
        }
        static fetchWebRTCConfig(api) {
            return new Promise((onRes, onErr) => {
                api.get('/fs/webrtc/config').then(res => {
                    onRes(res.content);
                }).catch(err => onErr(err));
            });
        }
    }
    //# sourceMappingURL=authentication.service.js.map

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
    //# sourceMappingURL=api.service.js.map

    /**
     * TODO : documentation
     */
    var ErrorCode;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["InvalidPhoneNumber"] = 2] = "InvalidPhoneNumber";
        ErrorCode[ErrorCode["UserMediaError"] = 3] = "UserMediaError";
        ErrorCode[ErrorCode["AgentNotConnected"] = 1] = "AgentNotConnected";
        ErrorCode[ErrorCode["ProtocolError"] = 4] = "ProtocolError";
    })(ErrorCode || (ErrorCode = {}));
    var ZiwoErrorCode;
    (function (ZiwoErrorCode) {
        ZiwoErrorCode[ZiwoErrorCode["ProtocolError"] = 1001] = "ProtocolError";
        ZiwoErrorCode[ZiwoErrorCode["MediaError"] = 1002] = "MediaError";
        ZiwoErrorCode[ZiwoErrorCode["MissingCall"] = 1003] = "MissingCall";
    })(ZiwoErrorCode || (ZiwoErrorCode = {}));
    var ZiwoEventType;
    (function (ZiwoEventType) {
        ZiwoEventType["Error"] = "error";
        ZiwoEventType["Connected"] = "connected";
        ZiwoEventType["Disconnected"] = "disconnected";
        ZiwoEventType["Requesting"] = "requesting";
        ZiwoEventType["Trying"] = "tring";
        ZiwoEventType["Ringing"] = "ringing";
        ZiwoEventType["Answering"] = "answering";
        ZiwoEventType["Active"] = "active";
        ZiwoEventType["Held"] = "held";
        ZiwoEventType["Hangup"] = "hangup";
        ZiwoEventType["Mute"] = "mute";
        ZiwoEventType["Unmute"] = "unmute";
        ZiwoEventType["Destroy"] = "destroy";
        ZiwoEventType["Recovering"] = "recovering";
    })(ZiwoEventType || (ZiwoEventType = {}));
    class ZiwoEvent {
        constructor(type, data) {
            this.type = type;
            this.data = data;
        }
        static subscribe(func) {
            this.listeners.push(func);
        }
        static emit(type, data) {
            this.listeners.forEach(x => x(type, data));
            window.dispatchEvent(new CustomEvent(type, { detail: data }));
        }
        static error(code, data) {
            window.dispatchEvent(new CustomEvent(ZiwoEventType.Error, { detail: {
                    code: code,
                    inner: data,
                } }));
        }
        emit() {
            ZiwoEvent.emit(this.type, this.data);
        }
    }
    ZiwoEvent.listeners = [];
    //# sourceMappingURL=events.js.map

    class MediaChannel {
        constructor(stream) {
            this.stream = stream;
            this.audioContext = this.getAudioContext();
        }
        static getUserMediaAsChannel(mediaRequested) {
            return new Promise((onRes, onErr) => {
                try {
                    navigator.mediaDevices.getUserMedia(mediaRequested).then((stream) => {
                        onRes(new MediaChannel(stream));
                    });
                }
                catch (e) {
                    onErr(e);
                }
            });
        }
        startMicrophone() {
            // see https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
            const filterNode = this.audioContext.createBiquadFilter();
            filterNode.type = 'highpass';
            // cutoff frequency: for highpass, audio is attenuated below this frequency
            filterNode.frequency.value = 10000;
            // create a gain node (to change audio volume)
            const gainNode = this.audioContext.createGain();
            // default is 1 (no change); less than 1 means audio is attenuated and vice versa
            gainNode.gain.value = 0.5;
            const source = this.audioContext.createMediaStreamSource(this.stream);
            this.microphone = {
                filterNode,
                gainNode,
                source,
            };
        }
        bindVideo(el) {
            el.srcObject = this.stream;
        }
        getAudioContext() {
            let audioContext;
            if (typeof AudioContext === 'function') {
                audioContext = new AudioContext();
            }
            else {
                throw new Error('Web audio not supported');
            }
            return audioContext;
        }
    }
    //# sourceMappingURL=media-channel.js.map

    class RTCPeerConnectionFactory {
        /**
         * We initiate the call
         */
        static outbound(verto, callId, login, phoneNumber) {
            const rtcPeerConnection = new RTCPeerConnection();
            rtcPeerConnection.ontrack = (tr) => {
                const track = tr.track;
                if (track.kind !== 'audio') {
                    return;
                }
                const stream = new MediaStream();
                stream.addTrack(track);
                if (!verto.channel) {
                    return;
                }
                verto.channel.remoteStream = stream;
                verto.tags.peerTag.srcObject = stream;
            };
            if (!verto.channel) {
                return rtcPeerConnection;
            }
            // Attach our media stream to the call's PeerConnection
            verto.channel.stream.getTracks().forEach((track) => {
                rtcPeerConnection.addTrack(track);
            });
            // We wait for candidate to be null to make sure all candidates have been processed
            rtcPeerConnection.onicecandidate = (candidate) => {
                var _a;
                if (!candidate.candidate) {
                    verto.send(verto.params.startCall(verto.sessid, callId, login, phoneNumber, (_a = rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp));
                }
            };
            rtcPeerConnection.createOffer().then((offer) => {
                rtcPeerConnection.setLocalDescription(offer).then(() => { });
            });
            return rtcPeerConnection;
        }
        /**
         * We receive the call
         */
        static inbound(verto, callId, login, sdp) {
            const rtcPeerConnection = new RTCPeerConnection();
            console.log('1');
            rtcPeerConnection.ontrack = (tr) => {
                console.log('6');
                const track = tr.track;
                if (track.kind !== 'audio') {
                    return;
                }
                console.log('7');
                const stream = new MediaStream();
                stream.addTrack(track);
                if (!verto.channel) {
                    return;
                }
                console.log('8');
                verto.channel.remoteStream = stream;
                verto.tags.peerTag.srcObject = stream;
            };
            console.log('2');
            if (!verto.channel) {
                return rtcPeerConnection;
            }
            console.log('3');
            // Attach our media stream to the call's PeerConnection
            verto.channel.stream.getTracks().forEach((track) => {
                console.log('9');
                rtcPeerConnection.addTrack(track);
            });
            console.log('4');
            // rtcPeerConnection.createOffer().then((offer:any) => {
            // console.log('10');
            // rtcPeerConnection.setLocalDescription(offer).then(() => {});
            // });
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdp }));
            console.log('5');
            return rtcPeerConnection;
        }
    }

    var CallStatus;
    (function (CallStatus) {
        CallStatus["Stopped"] = "stopped";
        CallStatus["Running"] = "running";
        CallStatus["OnHold"] = "onHold";
    })(CallStatus || (CallStatus = {}));
    /**
     * Call holds a call information and provide helpers
     */
    class Call {
        constructor(callId, verto, phoneNumber, login, direction, outboundDetails) {
            this.states = [];
            this.status = {
                call: CallStatus.Running,
                microphone: CallStatus.Running,
                camera: CallStatus.Stopped,
            };
            this.verto = verto;
            this.callId = callId;
            this.verto = verto;
            this.rtcPeerConnection = direction === 'outbound' ?
                RTCPeerConnectionFactory.outbound(verto, callId, login, phoneNumber) :
                RTCPeerConnectionFactory.inbound(verto, callId, login, outboundDetails.sdp);
            this.channel = verto.channel;
            this.phoneNumber = phoneNumber;
            this.direction = direction;
            this.outboundDetails = outboundDetails;
        }
        getCallStatus() {
            return this.status;
        }
        answer() {
            return new Promise((onRes, onErr) => {
                if (!this.outboundDetails) {
                    return onErr('Invalid SDP');
                }
                this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: this.outboundDetails.sdp }))
                    .then(r => {
                    return onRes();
                }).catch(e => onErr(e));
            });
        }
        hangup() {
            this.verto.hangupCall(this.callId, this.phoneNumber);
            this.status.call = CallStatus.Stopped;
        }
        hold() {
            this.verto.holdCall(this.callId, this.phoneNumber);
            this.status.call = CallStatus.OnHold;
        }
        unhold() {
            this.verto.unholdCall(this.callId, this.phoneNumber);
            this.status.call = CallStatus.Running;
        }
        mute() {
            this.toggleSelfStream(true);
            this.status.microphone = CallStatus.OnHold;
            // Because mute is not send/received over the socket, we throw the event manually from
            this.pushState(ZiwoEventType.Mute, true);
        }
        unmute() {
            this.toggleSelfStream(false);
            this.status.microphone = CallStatus.Running;
            this.pushState(ZiwoEventType.Unmute, true);
            // Because unmute is not send/received over the socket, we throw the event manually from
        }
        pushState(type, broadcast = false) {
            const d = new Date();
            this.states.push({
                state: type,
                date: d,
                dateUNIX: d.getTime() / 1000
            });
            if (broadcast) {
                ZiwoEvent.emit(type, {
                    type,
                    call: this,
                });
            }
        }
        toggleSelfStream(enabled) {
            this.channel.stream.getAudioTracks().forEach((tr) => {
                tr.enabled = enabled;
            });
        }
    }

    var VertoMethod;
    (function (VertoMethod) {
        VertoMethod["Login"] = "login";
        VertoMethod["ClientReady"] = "verto.clientReady";
        VertoMethod["Media"] = "verto.media";
        VertoMethod["Invite"] = "verto.invite";
        VertoMethod["Answer"] = "verto.answer";
        VertoMethod["Modify"] = "verto.modify";
        VertoMethod["Display"] = "verto.display";
        VertoMethod["Bye"] = "verto.bye";
    })(VertoMethod || (VertoMethod = {}));
    var VertoAction;
    (function (VertoAction) {
        VertoAction["Hold"] = "hold";
        VertoAction["Unhold"] = "unhold";
    })(VertoAction || (VertoAction = {}));
    class VertoParams {
        constructor() {
            this.id = 0;
        }
        wrap(method, params = {}, id = -1) {
            this.id += 1;
            return {
                jsonrpc: '2.0',
                method: method,
                id: id > 0 ? id : this.id,
                params: params,
            };
        }
        login(sessid, login, passwd) {
            return this.wrap(VertoMethod.Login, {
                sessid,
                login,
                passwd
            });
        }
        startCall(sessionId, callId, login, phoneNumber, sdp) {
            return this.wrap(VertoMethod.Invite, {
                sdp: sdp,
                sessid: sessionId,
                dialogParams: this.dialogParams(callId, login, phoneNumber),
            });
        }
        hangupCall(sessionId, callId, login, phoneNumber) {
            return this.wrap(VertoMethod.Bye, {
                cause: 'NORMAL_CLEARING',
                causeCode: 16,
                dialogParams: this.dialogParams(callId, login, phoneNumber),
                sessid: sessionId,
            });
        }
        holdCall(sessionId, callId, login, phoneNumber) {
            return this.wrap(VertoMethod.Modify, {
                action: 'hold',
                dialogParams: this.dialogParams(callId, login, phoneNumber),
                sessid: sessionId,
            });
        }
        unholdCall(sessionId, callId, login, phoneNumber) {
            return this.wrap(VertoMethod.Modify, {
                action: 'unhold',
                dialogParams: this.dialogParams(callId, login, phoneNumber),
                sessid: sessionId,
            });
        }
        answerCall(sessionId, callId, sdp) {
            return this.wrap(VertoMethod.Invite, {
                sdp: sdp,
                sessid: sessionId,
            });
        }
        getUuid() {
            /* tslint:disable */
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
                /* tslint:enable */
            });
        }
        dialogParams(callId, login, phoneNumber) {
            return {
                callID: callId,
                caller_id_name: '',
                caller_id_number: '',
                dedEnc: false,
                destination_number: phoneNumber,
                incomingBandwidth: 'default',
                localTag: null,
                login: login,
                outgoingBandwidth: 'default',
                remote_caller_id_name: 'Outbound Call',
                remote_caller_id_number: phoneNumber,
                screenShare: false,
                tag: this.getUuid(),
                useCamera: false,
                useMic: true,
                useSpeak: true,
                useStereo: true,
                useVideo: undefined,
                videoParams: {},
                audioParams: {
                    googAutoGainControl: false,
                    googNoiseSuppression: false,
                    googHighpassFilter: false
                },
            };
        }
    }
    //# sourceMappingURL=verto.params.js.map

    /**
     * Verto Orchestrator can be seen as the core component of our Verto implemented
     * Its role is to read all incoming message and act appropriately:
     *  - broadcast important messages as ZiwoEvent (incoming call, call set on hold, call answered, ...)
     *  - run appropriate commands if required by verto protocol (bind stream on verto.mediaRequest, clear call if verto.callDestroyed, ...)
     */
    class VertoOrchestrator {
        constructor(verto, debug) {
            this.CALL_ENDED_NOTIFICATION = 'CALL ENDED';
            this.debug = debug;
            this.verto = verto;
        }
        /**
         * We can identify 2 types of inputs:
         *  - message (or request): contains a `method` and usually requires further actions
         *  - notication: does not contain a `method` and does not require further actions. Provide call's update (hold, unhold, ...)
         */
        onInput(message, call) {
            return message.method ? this.handleMessage(message, call) : this.handleNotification(message, call);
        }
        handleMessage(message, call) {
            if (this.debug) {
                console.log('Incoming message ', message);
            }
            switch (message.method) {
                case VertoMethod.ClientReady:
                    return this.onClientReady(message);
                case VertoMethod.Media:
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onMedia(message, call);
                case VertoMethod.Invite:
                    this.pushState(call, ZiwoEventType.Trying);
                    return this.onInvite(message);
                case VertoMethod.Answer:
                    this.pushState(call, ZiwoEventType.Answering);
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onAnswer(message, call);
                case VertoMethod.Display:
                    // Not sure what is the purpose of this
                    return undefined;
            }
            return undefined;
        }
        handleNotification(message, call) {
            if (this.debug) {
                console.log('Incoming notification ', message);
            }
            if (!message.result || !message.result.action) {
                // Call ended does not have action but message 'CALL ENDED' only
                if (message.result.message === this.CALL_ENDED_NOTIFICATION && this.ensureCallIsExisting(call)) {
                    return this.handleCallEnded(message, call);
                }
                return undefined;
            }
            switch (message.result.action) {
                case VertoAction.Hold:
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onHold(call);
                case VertoAction.Unhold:
                    return !this.ensureCallIsExisting(call) ? undefined
                        : this.onUnhold(call);
            }
            return undefined;
        }
        handleCallEnded(message, call) {
            call.pushState(ZiwoEventType.Hangup);
            return new ZiwoEvent(ZiwoEventType.Hangup, {
                type: ZiwoEventType.Hangup,
                call: call,
                reason: message.result.cause,
            });
        }
        onClientReady(message) {
            return new ZiwoEvent(ZiwoEventType.Connected, {});
        }
        /***
         *** MESSAGE SECTION
         ***/
        /**
         * OnMedia requires to bind incoming Stream to our call's RtcPeerConnection
         * It should be transparent to users. No need to broadcast the event
         */
        onMedia(message, call) {
            call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.params.sdp }))
                .then(() => {
                if (this.debug) {
                    console.log('Remote media connected');
                }
            }).catch(() => {
                if (this.debug) {
                    console.warn('fail to attach remote media');
                }
            });
            return undefined;
        }
        onInvite(message) {
            return new ZiwoEvent(ZiwoEventType.Ringing, {
                type: ZiwoEventType.Ringing,
                call: new Call(message.params.callID, this.verto, message.params.verto_h_originalCallerIdNumber, this.verto.getLogin(), 'inbound', message.params),
            });
        }
        /**
         * Call has been answered by remote. Broadcast the event
         */
        onAnswer(message, call) {
            return new ZiwoEvent(ZiwoEventType.Answering, {
                type: ZiwoEventType.Answering,
                call: call,
            });
        }
        /***
         *** NOTIFICATION SECTION
         ***/
        onHold(call) {
            call.pushState(ZiwoEventType.Held);
            return new ZiwoEvent(ZiwoEventType.Held, {
                type: ZiwoEventType.Held,
                call: call,
            });
        }
        onUnhold(call) {
            call.pushState(ZiwoEventType.Active);
            return new ZiwoEvent(ZiwoEventType.Active, {
                type: ZiwoEventType.Active,
                call: call,
            });
        }
        /***
         *** OTHERS
         ***/
        /**
         * ensureCallIsExisting makes sure the call is not undefined.
         * If it is undefined, throw a meaningful error message
         */
        ensureCallIsExisting(call) {
            if (!call) {
                ZiwoEvent.error(ZiwoErrorCode.MissingCall, 'Received event from unknown callID');
                return false;
            }
            return true;
        }
        pushState(call, state) {
            if (call) {
                call.pushState(state);
            }
        }
    }
    //# sourceMappingURL=verto.orchestrator.js.map

    /**
     * JsonRpcClient implements Verto protocol using JSON RPC
     *
     * Usage:
     *  - const client = new JsonRpcClient(@debug); // Instantiate a new Json Rpc Client
     *  - client.openSocket(@socketUrl) // REQUIRED: Promise opening the web socket
     *      .then(() => {
     *        this.login() // REQUIRED: log the agent into the web socket
     *        // You can now proceed with any requests
     *      });
     *
     */
    class Verto {
        constructor(calls, debug, tags) {
            /**
             * Callback functions - register using `addListener`
             */
            this.listeners = [];
            this.ICE_SERVER = 'stun:stun.l.google.com:19302';
            this.debug = debug;
            this.tags = tags;
            this.orchestrator = new VertoOrchestrator(this, this.debug);
            this.params = new VertoParams();
            this.calls = calls;
        }
        /**
         * addListener allows to listen for incoming Socket Event
         */
        addListener(call) {
            this.listeners.push(call);
        }
        connectAgent(agent) {
            return new Promise((onRes, onErr) => {
                // First we make ensure access to microphone &| camera
                // And wait for the socket to open
                Promise.all([
                    MediaChannel.getUserMediaAsChannel({ audio: true, video: false }),
                    this.openSocket(agent.webRtc.socket),
                ]).then(res => {
                    this.channel = res[0];
                    this.login(agent.position);
                }).catch(err => {
                    onErr(err);
                });
            });
        }
        /**
         * send a start call request
         */
        startCall(phoneNumber) {
            if (!this.channel || !this.channel.stream) {
                // TODO : throw Ziwo Error Event
                throw new Error('Error in User Media');
            }
            return new Call(this.params.getUuid(), this, phoneNumber, this.getLogin(), 'outbound');
        }
        /**
         * Answer a call
         */
        answerCall(callId, sdp) {
            this.send(this.params.answerCall(this.sessid, callId, sdp));
        }
        /**
         * Hang up a specific call
         */
        hangupCall(callId, phoneNumber) {
            this.send(this.params.hangupCall(this.sessid, callId, this.getLogin(), phoneNumber));
        }
        /**
         * Hold a specific call
         */
        holdCall(callId, phoneNumber) {
            this.send(this.params.holdCall(this.sessid, callId, this.getLogin(), phoneNumber));
        }
        /**
         * Hang up a specific call
         */
        unholdCall(callId, phoneNumber) {
            this.send(this.params.unholdCall(this.sessid, callId, this.getLogin(), phoneNumber));
        }
        /**
         * Send data to socket and log in case of debug
         */
        send(data) {
            if (this.debug) {
                console.log('Write message > ', data);
            }
            if (!this.socket) {
                return;
            }
            this.socket.send(JSON.stringify(data));
        }
        /**
         * login log the agent in the newly created socket
         */
        login(agentPosition) {
            this.position = agentPosition;
            return new Promise((onRes, onErr) => {
                if (!this.socket) {
                    return onErr();
                }
                this.sessid = this.params.getUuid();
                this.send(this.params.login(this.sessid, agentPosition.name, agentPosition.password));
            });
        }
        /**
         * openSocket should be called directly after the constructor
         * It initializate the socket and set the handlers
         */
        openSocket(socketUrl) {
            return new Promise((onRes, onErr) => {
                this.socket = new WebSocket(socketUrl);
                this.socket.onclose = () => {
                    if (this.debug) {
                        console.log('Socket closed');
                    }
                };
                this.socket.onopen = () => {
                    if (this.debug) {
                        console.log('Socket opened');
                    }
                    onRes();
                };
                this.socket.onmessage = (msg) => {
                    try {
                        const data = JSON.parse(msg.data);
                        if (!this.isJsonRpcValid) {
                            ZiwoEvent.error(ZiwoErrorCode.ProtocolError, data);
                            throw new Error('Message is not a valid format');
                        }
                        const callId = data.params && data.params.callID ? data.params.callID :
                            (data.result && data.result.callID ? data.result.callID : undefined);
                        const relatedCall = callId ? this.calls.find(c => c.callId === callId) : undefined;
                        const ev = this.orchestrator.onInput(data, relatedCall);
                        if (ev) {
                            ev.emit();
                        }
                    }
                    catch (err) {
                        ZiwoEvent.error(ZiwoErrorCode.ProtocolError, err);
                        if (this.debug) {
                            console.warn('Invalid incoming message', err);
                        }
                    }
                };
            });
        }
        getNewRTCPeerConnection() {
            const rtcPeerConnection = new RTCPeerConnection({
                iceServers: [{ urls: this.ICE_SERVER }],
            });
            return rtcPeerConnection;
        }
        /**
         * Concat position to return the login used in Json RTC request
         */
        getLogin() {
            var _a, _b;
            return `${(_a = this.position) === null || _a === void 0 ? void 0 : _a.name}@${(_b = this.position) === null || _b === void 0 ? void 0 : _b.hostname}`;
        }
        ensureMediaChannelIsValid() {
            if (!this.channel || !this.channel.stream) {
                ZiwoEvent.error(ZiwoErrorCode.MediaError, MESSAGES.MEDIA_ERROR);
                return false;
            }
            return true;
        }
        /**
         * Validate the JSON RPC headersx
         */
        isJsonRpcValid(data) {
            return typeof data === 'object'
                && 'jsonrpc' in data
                && data.jsonrpc === '2.0';
        }
    }
    //# sourceMappingURL=verto.js.map

    class ZiwoClient {
        constructor(options) {
            this.calls = [];
            this.options = options;
            this.debug = options.debug || false;
            this.apiService = new ApiService(options.contactCenterName);
            this.verto = new Verto(this.calls, this.debug, options.tags);
            if (options.autoConnect) {
                this.connect().then(r => {
                }).catch(err => { throw err; });
            }
        }
        /**
         * connect authenticate the user over Ziwo & our communication socket
         * This function is required before proceeding with calls
         */
        connect() {
            return new Promise((onRes, onErr) => {
                AuthenticationService.authenticate(this.apiService, this.options.credentials)
                    .then(res => {
                    this.connectedAgent = res;
                    this.verto.connectAgent(this.connectedAgent);
                    onRes();
                }).catch(err => onErr(err));
            });
        }
        addListener(func) {
            return ZiwoEvent.subscribe(func);
        }
        startCall(phoneNumber) {
            const call = this.verto.startCall(phoneNumber);
            this.calls.push(call);
            return call;
        }
    }
    //# sourceMappingURL=main.js.map

    exports.ZiwoClient = ZiwoClient;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ziwo-core-front.umd.js.map
