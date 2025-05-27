"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var liveness_controller_1 = require("../controllers/liveness.controller");
var router = (0, express_1.Router)();
var upload = (0, multer_1.default)();
router.post('/create-liveness-session', liveness_controller_1.createLivenessSession);
router.get('/get-liveness-results/:sessionId', liveness_controller_1.getLivenessResults);
router.get('/verification/retries/:projectId/:userId', liveness_controller_1.verificationRetries);
router.post('/verification/:projectId/upload-liveness', upload.none(), liveness_controller_1.verificationLivenessUpload);
exports.default = router;
//# sourceMappingURL=liveness.routes.js.map