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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationUploadService = exports.verificationRetriesService = exports.getLivenessResultsService = exports.createLivenessSessionService = exports.uploadVerificationData = exports.getVerificationRetries = exports.getLivenessResults = exports.createLivenessSession = void 0;
var client_rekognition_1 = require("@aws-sdk/client-rekognition");
var credential_providers_1 = require("@aws-sdk/credential-providers");
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
// ==================== CONSTANTS ====================
var SUPPORTED_PROJECTS = {
    CATHOLIC_PAY: 'CatholicPay'
};
var DEFAULT_VALUES = {
    ACTIVITY: 'default',
    INAPP_ACTIVITY: 'inapp_verification',
    SESSION_ID: 'default',
    AUDIT_IMAGES_LIMIT: 2
};
var HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
};
// ==================== CLIENT CONFIGURATION ====================
var createRekognitionClient = function () {
    return new client_rekognition_1.RekognitionClient({
        region: process.env.AWS_REGION,
        credentials: (0, credential_providers_1.fromIni)({ profile: process.env.AWS_PROFILE }),
    });
};
var rekognitionClient = createRekognitionClient();
// ==================== UTILITY FUNCTIONS ====================
var createErrorResponse = function (message, data, code) {
    if (data === void 0) { data = null; }
    if (code === void 0) { code = HTTP_STATUS.INTERNAL_SERVER_ERROR; }
    return ({
        message: message,
        data: data,
        success: false,
        code: code
    });
};
var createSuccessResponse = function (message, data, code) {
    if (data === void 0) { data = null; }
    if (code === void 0) { code = HTTP_STATUS.OK; }
    return ({
        message: message,
        data: data,
        success: true,
        code: code
    });
};
var getAuthHeaders = function (secretKey) { return ({
    'Accept': 'application/json',
    'Authorization': "Bearer ".concat(secretKey),
}); };
var validateEnvironmentVariables = function (requiredVars) {
    var missing = requiredVars.filter(function (varName) { return !process.env[varName]; });
    if (missing.length > 0) {
        throw new Error("Missing required environment variables: ".concat(missing.join(', ')));
    }
};
// ==================== AWS REKOGNITION SERVICES ====================
var createLivenessSession = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (settings) {
        var input, command, response, error_1;
        if (settings === void 0) { settings = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    validateEnvironmentVariables(['S3_BUCKET']);
                    input = {
                        Settings: {
                            OutputConfig: {
                                S3Bucket: settings.outputBucket || process.env.S3_BUCKET,
                                S3KeyPrefix: settings.keyPrefix || process.env.S3_KEY_PREFIX,
                            },
                            AuditImagesLimit: settings.auditImagesLimit || DEFAULT_VALUES.AUDIT_IMAGES_LIMIT,
                        },
                    };
                    command = new client_rekognition_1.CreateFaceLivenessSessionCommand(input);
                    return [4 /*yield*/, rekognitionClient.send(command)];
                case 1:
                    response = _a.sent();
                    if (!response.SessionId) {
                        throw new Error('Failed to create liveness session: No session ID returned');
                    }
                    return [2 /*return*/, response.SessionId];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error creating liveness session:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.createLivenessSession = createLivenessSession;
var getLivenessResults = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!sessionId) {
                    throw new Error('Session ID is required');
                }
                command = new client_rekognition_1.GetFaceLivenessSessionResultsCommand({
                    SessionId: sessionId,
                });
                return [4 /*yield*/, rekognitionClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
            case 2:
                error_2 = _a.sent();
                console.error('Error getting liveness results:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getLivenessResults = getLivenessResults;
// ==================== VERIFICATION SERVICES ====================
var getVerificationRetries = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var projectId, userId, _a, activity, apiUrl, secretKey, response, error_3;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                projectId = data.projectId, userId = data.userId, _a = data.activity, activity = _a === void 0 ? DEFAULT_VALUES.ACTIVITY : _a;
                if (projectId !== SUPPORTED_PROJECTS.CATHOLIC_PAY) {
                    return [2 /*return*/, createErrorResponse('Unsupported project ID', null, HTTP_STATUS.BAD_REQUEST)];
                }
                _g.label = 1;
            case 1:
                _g.trys.push([1, 3, , 4]);
                validateEnvironmentVariables(['CATHOLICPAY_API_URL', 'CATHOLICPAY_SECRET_KEY']);
                apiUrl = "".concat(process.env.CATHOLICPAY_API_URL, "/verification/retries");
                secretKey = process.env.CATHOLICPAY_SECRET_KEY;
                return [4 /*yield*/, axios_1.default.get(apiUrl, {
                        params: {
                            user_id: userId,
                            activity: activity,
                        },
                        headers: getAuthHeaders(secretKey),
                    })];
            case 2:
                response = _g.sent();
                return [2 /*return*/, createSuccessResponse('Retries returned successfully', response.data.data)];
            case 3:
                error_3 = _g.sent();
                console.error('Error fetching verification retries:', error_3);
                return [2 /*return*/, createErrorResponse(((_c = (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch retries', ((_e = (_d = error_3.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.data) || null, ((_f = error_3.response) === null || _f === void 0 ? void 0 : _f.status) || HTTP_STATUS.INTERNAL_SERVER_ERROR)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getVerificationRetries = getVerificationRetries;
var uploadVerificationData = function (data, projectId) { return __awaiter(void 0, void 0, void 0, function () {
    var form, apiUrl, secretKey, response, responseData, error_4;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (projectId !== SUPPORTED_PROJECTS.CATHOLIC_PAY) {
                    return [2 /*return*/, createErrorResponse('Unsupported project ID', null, HTTP_STATUS.BAD_REQUEST)];
                }
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                validateEnvironmentVariables(['CATHOLICPAY_API_URL', 'CATHOLICPAY_SECRET_KEY']);
                form = createFormData(data);
                apiUrl = "".concat(process.env.CATHOLICPAY_API_URL, "/verification/save-liveness");
                secretKey = process.env.CATHOLICPAY_SECRET_KEY;
                return [4 /*yield*/, axios_1.default.post(apiUrl, form, {
                        headers: __assign(__assign({}, form.getHeaders()), getAuthHeaders(secretKey)),
                    })];
            case 2:
                response = _f.sent();
                responseData = response.data;
                return [2 /*return*/, createSuccessResponse(responseData.message || 'Liveness saved successfully', responseData.data || null, responseData.code || HTTP_STATUS.OK)];
            case 3:
                error_4 = _f.sent();
                return [2 /*return*/, createErrorResponse(((_b = (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to save liveness', ((_d = (_c = error_4.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.data) || null, ((_e = error_4.response) === null || _e === void 0 ? void 0 : _e.status) || HTTP_STATUS.INTERNAL_SERVER_ERROR)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.uploadVerificationData = uploadVerificationData;
var createFormData = function (data) {
    var user_id = data.user_id, _a = data.session_id, session_id = _a === void 0 ? DEFAULT_VALUES.SESSION_ID : _a, _b = data.activity, activity = _b === void 0 ? DEFAULT_VALUES.INAPP_ACTIVITY : _b, _c = data.audit_image_urls, audit_image_urls = _c === void 0 ? [] : _c, _d = data.confidence_level, confidence_level = _d === void 0 ? '' : _d, _e = data.retries, retries = _e === void 0 ? '' : _e;
    var form = new form_data_1.default();
    form.append('user_id', String(user_id));
    form.append('session_id', String(session_id));
    form.append('activity', String(activity));
    form.append('confidence_level', String(confidence_level));
    form.append('retries', String(retries));
    // Add audit image URLs if they exist
    audit_image_urls
        .filter(Boolean)
        .forEach(function (url) {
        form.append('audit_image_urls[]', url);
    });
    return form;
};
exports.createLivenessSessionService = exports.createLivenessSession;
exports.getLivenessResultsService = exports.getLivenessResults;
exports.verificationRetriesService = exports.getVerificationRetries;
exports.verificationUploadService = exports.uploadVerificationData;
//# sourceMappingURL=liveness.service.js.map