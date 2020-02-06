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

const MESSAGE_PREFIX = '[LIB Ziwo-core-front] ';
const MESSAGES = {
    EMAIL_PASSWORD_AUTHTOKEN_MISSING: `${MESSAGE_PREFIX}Email or password are missing and no authentication token were provided.`,
    INVALID_PHONE_NUMBER: (phoneNumber) => `${phoneNumber} is not a valid phone number`,
    AGENT_NOT_CONNECTED: (action) => `Agent is not connected. Cannot proceed '${action}'`,
};

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

/**
 * TODO : documentation
 * TODO : define interface for each available type?
 * TODO : define all event type
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["InvalidPhoneNumber"] = 2] = "InvalidPhoneNumber";
    ErrorCode[ErrorCode["UserMediaError"] = 3] = "UserMediaError";
    ErrorCode[ErrorCode["AgentNotConnected"] = 1] = "AgentNotConnected";
    ErrorCode[ErrorCode["ProtocolError"] = 4] = "ProtocolError";
})(ErrorCode || (ErrorCode = {}));
var ZiwoEventType;
(function (ZiwoEventType) {
    ZiwoEventType["Error"] = "Error";
    ZiwoEventType["AgentConnected"] = "AgentConnected";
    ZiwoEventType["IncomingCall"] = "IncomingCall";
    ZiwoEventType["OutgoingCall"] = "OutgoingCall";
    ZiwoEventType["CallStarted"] = "CallStarted";
    ZiwoEventType["CallEndedByUser"] = "CallEndedByUser";
    ZiwoEventType["CallEndedByPeer"] = "CallEndedByPeer";
})(ZiwoEventType || (ZiwoEventType = {}));
class ZiwoEvent {
    static subscribe(func) {
        this.listeners.push(func);
    }
    static emit(type, data) {
        this.listeners.forEach(x => x(type, data));
    }
}
ZiwoEvent.listeners = [];

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

var JsonRpcMethod;
(function (JsonRpcMethod) {
    JsonRpcMethod["login"] = "login";
    JsonRpcMethod["invite"] = "verto.invite";
    JsonRpcMethod["modify"] = "verto.modify";
    JsonRpcMethod["bye"] = "verto.bye";
})(JsonRpcMethod || (JsonRpcMethod = {}));
var JsonRpcActionId;
(function (JsonRpcActionId) {
    JsonRpcActionId[JsonRpcActionId["login"] = 3] = "login";
    JsonRpcActionId[JsonRpcActionId["invite"] = 4] = "invite";
})(JsonRpcActionId || (JsonRpcActionId = {}));
class JsonRpcParams {
    static wrap(method, id = 0, params = {}) {
        return {
            jsonrpc: '2.0',
            method: method,
            id: id,
            params: params,
        };
    }
    static login(sessid, login, passwd) {
        return this.wrap(JsonRpcMethod.login, 3, {
            sessid,
            login,
            passwd
        });
    }
    static startCall(sessionId, callId, login, phoneNumber, sdp) {
        return this.wrap(JsonRpcMethod.invite, 4, {
            sdp: sdp,
            sessid: sessionId,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static hangupCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.bye, 9, {
            cause: 'NORMAL_CLEARING',
            causeCode: 16,
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static holdCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.modify, 11, {
            action: 'hold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static unholdCall(sessionid, callId, login, phoneNumber) {
        return this.wrap(JsonRpcMethod.modify, 10, {
            action: 'unhold',
            dialogParams: this.dialogParams(callId, login, phoneNumber),
        });
    }
    static getUuid() {
        /* tslint:disable */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            /* tslint:enable */
        });
    }
    static dialogParams(callId, login, phoneNumber) {
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
    constructor(callId, jsonRpcClient, rtcPeerConnection, channel, phoneNumber) {
        this.status = {
            call: CallStatus.Running,
            microphone: CallStatus.Running,
            camera: CallStatus.Stopped,
        };
        this.jsonRpcClient = jsonRpcClient;
        this.callId = callId;
        this.rtcPeerConnection = rtcPeerConnection;
        this.channel = channel;
        this.phoneNumber = phoneNumber;
    }
    getCallStatus() {
        return this.status;
    }
    answer() {
        console.warn('Answer not implemented');
    }
    hangup() {
        this.jsonRpcClient.hangupCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Stopped;
    }
    hold() {
        this.jsonRpcClient.holdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.OnHold;
    }
    unhold() {
        this.jsonRpcClient.unholdCall(this.callId, this.phoneNumber);
        this.status.call = CallStatus.Running;
    }
    mute() {
        this.toggleSelfStream(true);
        this.status.microphone = CallStatus.OnHold;
    }
    unmute() {
        this.toggleSelfStream(false);
        this.status.microphone = CallStatus.Running;
    }
    toggleSelfStream(enabled) {
        this.channel.stream.getAudioTracks().forEach((tr) => {
            tr.enabled = enabled;
        });
    }
}

var JsonRpcEventType;
(function (JsonRpcEventType) {
    JsonRpcEventType["Unknown"] = "Unknown";
    JsonRpcEventType["LoggedIn"] = "LoggedIn";
    JsonRpcEventType["OutgoingCall"] = "OutgoingCall";
    JsonRpcEventType["MediaRequest"] = "MediaRequest";
})(JsonRpcEventType || (JsonRpcEventType = {}));

/**
 * JsonRpcParser parse an incoming message and will target a specific element to determine its type.
 */
class JsonRpcParser {
    static parse(data) {
        if (this.isLoggedIn(data)) {
            return {
                type: JsonRpcEventType.LoggedIn,
                raw: data,
                payload: data.params,
            };
        }
        if (this.isOutgoingCall(data)) {
            return {
                type: JsonRpcEventType.OutgoingCall,
                raw: data,
                payload: data.result,
            };
        }
        if (this.isMediaRequest(data)) {
            return {
                type: JsonRpcEventType.MediaRequest,
                raw: data,
                payload: data.params,
            };
        }
        return {
            type: JsonRpcEventType.Unknown,
            raw: data,
            payload: data
        };
    }
    static isLoggedIn(data) {
        return data.id === JsonRpcActionId.login;
    }
    static isOutgoingCall(data) {
        return data.id === JsonRpcActionId.invite;
    }
    static isMediaRequest(data) {
        return data.method === 'verto.media';
    }
}

class JsonRpcBase {
    constructor(debug) {
        /**
         * Callback functions - register using `addListener`
         */
        this.listeners = [];
        this.debug = debug || false;
    }
    /**
     * addListener allows to listener for incoming Socket Event
     */
    addListener(call) {
        this.listeners.push(call);
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
                    console.warn('Socket closed');
                }
            };
            this.socket.onopen = () => {
                onRes();
            };
            this.socket.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (!this.isJsonRpcValid) {
                        throw new Error('Invalid Incoming JSON RPC');
                    }
                    this.listeners.forEach(fn => fn(JsonRpcParser.parse(data)));
                }
                catch (err) {
                    console.warn('Invalid Message', msg);
                    // NOTE : not sure if we should throw an error here -- need live testing to enable/disable
                    ZiwoEvent.emit(ZiwoEventType.Error, {
                        code: ErrorCode.ProtocolError,
                        message: err,
                    });
                }
            };
        });
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
     * Concat position to return the login used in Json RTC request
     */
    getLogin() {
        var _a, _b;
        return `${(_a = this.position) === null || _a === void 0 ? void 0 : _a.name}@${(_b = this.position) === null || _b === void 0 ? void 0 : _b.hostname}`;
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

var ZiwoSocketEvent;
(function (ZiwoSocketEvent) {
    ZiwoSocketEvent["LoggedIn"] = "LoggedIn";
    ZiwoSocketEvent["CallCreated"] = "CallCreated";
})(ZiwoSocketEvent || (ZiwoSocketEvent = {}));
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
class JsonRpcClient extends JsonRpcBase {
    constructor(debug) {
        super(debug);
        this.ICE_SERVER = 'stun:stun.l.google.com:19302';
    }
    /**
     * Following functions send a request to the opened socket. They do not return the result of the request
     * Instead, you should use `addListener` and use the Socket events to follow the status of the request.
     */
    /**
     * login log the agent in the newly created socket
     */
    login(agentPosition) {
        this.position = agentPosition;
        return new Promise((onRes, onErr) => {
            if (!this.socket) {
                return onErr();
            }
            this.sessid = JsonRpcParams.getUuid();
            this.send(JsonRpcParams.login(this.sessid, agentPosition.name, agentPosition.password));
        });
    }
    /**
     * send a start call request
     */
    startCall(phoneNumber, callId, channel, tags) {
        if (!channel.stream) {
            throw new Error('Error in User Media');
        }
        // Create Call and its PeerConnection
        const call = new Call(callId, this, new RTCPeerConnection({
            iceServers: [{ urls: this.ICE_SERVER }],
        }), channel, phoneNumber);
        call.rtcPeerConnection.ontrack = (tr) => {
            const track = tr.track;
            if (track.kind !== 'audio') {
                return;
            }
            const stream = new MediaStream();
            stream.addTrack(track);
            channel.remoteStream = stream;
            tags.peerTag.srcObject = stream;
        };
        // Attach our media stream to the call's PeerConnection
        channel.stream.getTracks().forEach((track) => {
            call.rtcPeerConnection.addTrack(track);
        });
        // We wait for candidate to be null to make sure all candidates have been processed
        call.rtcPeerConnection.onicecandidate = (candidate) => {
            var _a;
            if (!candidate.candidate) {
                this.send(JsonRpcParams.startCall(this.sessid, call.callId, this.getLogin(), phoneNumber, (_a = call.rtcPeerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp));
            }
        };
        call.rtcPeerConnection.createOffer().then(offer => {
            call.rtcPeerConnection.setLocalDescription(offer).then(() => { });
        });
        return call;
    }
    /**
     * Hang up a specific call
     */
    hangupCall(callId, phoneNumber) {
        this.send(JsonRpcParams.hangupCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hold a specific call
     */
    holdCall(callId, phoneNumber) {
        this.send(JsonRpcParams.holdCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
    /**
     * Hang up a specific call
     */
    unholdCall(callId, phoneNumber) {
        this.send(JsonRpcParams.unholdCall(this.sessid, callId, this.getLogin(), phoneNumber));
    }
}

/**
 * RtcClientBase handles authentication and holds core properties
 */
class RtcClientBase {
    constructor(tags, debug) {
        this.calls = [];
        this.debug = debug || false;
        this.tags = tags;
    }
    /**
     * Get connected Agent returns the Info of the current agent
     */
    getConnectedAgent() {
        return this.connectedAgent;
    }
    /**
     * Return true if an agent is connected
     */
    isAgentConnected() {
        return !!this.connectedAgent && !!this.channel;
    }
    sendNotConnectedEvent(action) {
        return ZiwoEvent.emit(ZiwoEventType.Error, {
            code: ErrorCode.InvalidPhoneNumber,
            message: MESSAGES.AGENT_NOT_CONNECTED(action),
        });
    }
}

class RtcClientHandlers extends RtcClientBase {
    constructor(tags, debug) {
        super(tags, debug);
    }
    outgoingCall(data) {
        if (this.currentCall) {
            return console.warn('Outgoing Call - but there is already a call in progress');
        }
    }
    acceptMediaRequest(data) {
        const call = this.calls.find(x => x.callId === data.callID);
        if (!call) {
            return; // invalid call id?
        }
        call.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }))
            .then(() => console.log('Remote media connected'))
            .catch(() => console.warn('fail to attach remote media'));
        // call.answer();
    }
}

const PATTERNS = {
    phoneNumber: /^\+?\d+$/,
};

/**
 * RtcClient wraps all interaction with WebRTC
 * It holds the validation & all properties required for usage of Web RTC
 */
class RtcClient extends RtcClientHandlers {
    constructor(tags, debug) {
        super(tags, debug);
    }
    /**
     * User Agent Info to authenticate on the socket
     * Also requests access to User Media (audio &| video)
     */
    connectAgent(agent) {
        return new Promise((onRes, onErr) => {
            this.connectedAgent = agent;
            this.jsonRpcClient = new JsonRpcClient(this.debug);
            // First we make ensure access to microphone &| camera
            // And wait for the socket to open
            Promise.all([
                MediaChannel.getUserMediaAsChannel({ audio: true, video: false }),
                this.jsonRpcClient.openSocket(this.connectedAgent.webRtc.socket),
            ]).then(res => {
                var _a, _b;
                this.channel = res[0];
                (_a = this.jsonRpcClient) === null || _a === void 0 ? void 0 : _a.addListener((ev) => {
                    if (ev.type === JsonRpcEventType.LoggedIn) {
                        ZiwoEvent.emit(ZiwoEventType.AgentConnected);
                        onRes();
                        return;
                    }
                    // This is our global handler for incoming message
                    this.processIncomingSocketMessage(ev);
                });
                (_b = this.jsonRpcClient) === null || _b === void 0 ? void 0 : _b.login(agent.position);
            }).catch(err => {
                onErr(err);
            });
        });
    }
    /**
     * Start a phone call and return a Call or undefined if an error occured
     */
    startCall(phoneNumber) {
        var _a;
        if (!this.isAgentConnected() || !this.channel || !this.jsonRpcClient) {
            this.sendNotConnectedEvent('start call');
            return;
        }
        if (!PATTERNS.phoneNumber.test(phoneNumber)) {
            ZiwoEvent.emit(ZiwoEventType.Error, {
                code: ErrorCode.InvalidPhoneNumber,
                message: MESSAGES.INVALID_PHONE_NUMBER(phoneNumber),
                data: {
                    phoneNumber: phoneNumber,
                }
            });
            return;
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.startMicrophone();
        const call = this.jsonRpcClient.startCall(phoneNumber, JsonRpcParams.getUuid(), this.channel, this.tags);
        this.calls.push(call);
        return call;
    }
    /**
     * Process message
     */
    processIncomingSocketMessage(ev) {
        if (this.debug) {
            console.log('New incoming message', ev);
        }
        switch (ev.type) {
            case JsonRpcEventType.OutgoingCall:
                this.outgoingCall(ev.payload);
                break;
            case JsonRpcEventType.MediaRequest:
                this.acceptMediaRequest(ev.payload);
                break;
        }
    }
}

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

class ZiwoClient {
    constructor(options) {
        this.options = options;
        this.apiService = new ApiService(options.contactCenterName);
        this.rtcClient = new RtcClient(options.tags, options.debug);
        if (options.autoConnect) {
            this.connect().then(r => {
            }).catch(err => { throw err; });
        }
    }
    connect() {
        return new Promise((onRes, onErr) => {
            AuthenticationService.authenticate(this.apiService, this.options.credentials)
                .then(res => {
                this.rtcClient.connectAgent(res);
                onRes(res);
            }).catch(err => onErr(err));
        });
    }
    addListener(func) {
        return ZiwoEvent.subscribe(func);
    }
    startCall(phoneNumber) {
        return this.rtcClient.startCall(phoneNumber);
    }
}

export { ZiwoClient };
//# sourceMappingURL=ziwo-core-front.es5.js.map
