"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationUploadService = exports.verificationRetriesService = exports.getLivenessResultsService = exports.createLivenessSessionService = void 0;
var client_rekognition_1 = require("@aws-sdk/client-rekognition");
var credential_providers_1 = require("@aws-sdk/credential-providers");
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var client = new client_rekognition_1.RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: (0, credential_providers_1.fromIni)({ profile: process.env.AWS_PROFILE }),
});
var createLivenessSessionService = function () { return __awaiter(void 0, void 0, void 0, function () {
    var input, command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = {
                    Settings: {
                        OutputConfig: {
                            S3Bucket: process.env.S3_BUCKET,
                            S3KeyPrefix: process.env.S3_KEY_PREFIX,
                        },
                        AuditImagesLimit: 2,
                    },
                };
                command = new client_rekognition_1.CreateFaceLivenessSessionCommand(input);
                return [4 /*yield*/, client.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.SessionId];
        }
    });
}); };
exports.createLivenessSessionService = createLivenessSessionService;
var getLivenessResultsService = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_rekognition_1.GetFaceLivenessSessionResultsCommand({
                    SessionId: sessionId,
                });
                return [4 /*yield*/, client.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
exports.getLivenessResultsService = getLivenessResultsService;
var verificationRetriesService = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var projectId, userId, activity, cpay_url, secret, response, error_1;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                projectId = data.projectId;
                userId = data.userId;
                activity = data.activity || 'default';
                if (!(projectId === "CatholicPay")) return [3 /*break*/, 4];
                _g.label = 1;
            case 1:
                _g.trys.push([1, 3, , 4]);
                cpay_url = process.env.CATHOLICPAY_API_URL + '/verification/retries';
                secret = process.env.CATHOLICPAY_SECRET_KEY;
                return [4 /*yield*/, axios_1.default.get(cpay_url, {
                        params: {
                            user_id: userId,
                            activity: activity,
                        },
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': "Bearer ".concat(secret),
                        },
                    })];
            case 2:
                response = _g.sent();
                return [2 /*return*/, {
                        message: 'Retries returned successfully',
                        data: (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data,
                        success: true,
                        code: 200
                    }];
            case 3:
                error_1 = _g.sent();
                return [2 /*return*/, {
                        message: ((_c = (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch retries',
                        data: ((_e = (_d = error_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.data) || null,
                        success: false,
                        code: ((_f = error_1.response) === null || _f === void 0 ? void 0 : _f.status) || 500,
                    }];
            case 4: return [2 /*return*/, { message: 'Retry verification endpoint', data: null, success: false, code: 400 }];
        }
    });
}); };
exports.verificationRetriesService = verificationRetriesService;
var verificationUploadService = function (data, projectId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, session_id, activity, audit_image_urls, confidence_level, retries, form_1, cpay_url, secret, response, respData, error_2;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                userId = data.user_id;
                session_id = data.session_id || 'default';
                activity = data.activity || 'inapp_verification';
                audit_image_urls = data.audit_image_urls || [];
                confidence_level = data.confidence_level || '';
                retries = data.retries || '';
                if (!(projectId === "CatholicPay")) return [3 /*break*/, 4];
                _g.label = 1;
            case 1:
                _g.trys.push([1, 3, , 4]);
                form_1 = new form_data_1.default();
                form_1.append('user_id', String(userId));
                form_1.append('session_id', String(session_id));
                form_1.append('activity', String(activity));
                audit_image_urls.filter(Boolean).forEach(function (url) {
                    form_1.append('audit_image_urls[]', url);
                });
                form_1.append('confidence_level', String(confidence_level));
                form_1.append('retries', String(retries));
                cpay_url = process.env.CATHOLICPAY_API_URL + '/verification/save-liveness';
                secret = process.env.CATHOLICPAY_SECRET_KEY;
                return [4 /*yield*/, axios_1.default.post(cpay_url, form_1, {
                        headers: __assign(__assign({}, form_1.getHeaders()), { 'Accept': 'application/json', 'Authorization': "Bearer ".concat(secret) }),
                    })];
            case 2:
                response = _g.sent();
                respData = response.data;
                return [2 /*return*/, {
                        message: respData.message || 'Liveness saved successfully',
                        data: respData.data || null,
                        success: (_a = respData.success) !== null && _a !== void 0 ? _a : true,
                        code: respData.code || 200
                    }];
            case 3:
                error_2 = _g.sent();
                return [2 /*return*/, {
                        message: ((_c = (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to save liveness',
                        data: ((_e = (_d = error_2.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.data) || null,
                        success: false,
                        code: ((_f = error_2.response) === null || _f === void 0 ? void 0 : _f.status) || 500,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verificationUploadService = verificationUploadService;
//# sourceMappingURL=liveness.service.js.map