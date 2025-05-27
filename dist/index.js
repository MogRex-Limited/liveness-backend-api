"use strict";
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
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var client_rekognition_1 = require("@aws-sdk/client-rekognition");
var credential_providers_1 = require("@aws-sdk/credential-providers");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var client = new client_rekognition_1.RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: (0, credential_providers_1.fromIni)({ profile: process.env.AWS_PROFILE }),
});
app.post('/create-liveness-session', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var input, command, response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                input = {
                    // ClientRequestToken: `session-${Date.now()}`,
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
                res.json({ sessionId: response.SessionId });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('Error creating session:', err_1);
                res.status(500).json({ error: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/', function (req, res) {
    var name = process.env.NAME || 'World';
    res.send("Hello ".concat(name, "!"));
});
app.get('/get-liveness-results/:sessionId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                command = new client_rekognition_1.GetFaceLivenessSessionResultsCommand({
                    SessionId: req.params.sessionId,
                });
                return [4 /*yield*/, client.send(command)];
            case 1:
                response = _a.sent();
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error('Error getting results:', err_2);
                res.status(500).json({ error: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, function () {
    console.log("Liveness Server running on http://".concat(HOST, ":").concat(PORT));
});
//# sourceMappingURL=index.js.map