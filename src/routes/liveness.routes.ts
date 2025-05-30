import { Router } from 'express';
import multer from 'multer';

import {
  createLivenessSession,
  getLivenessResults,
  verificationLivenessUpload,
  verificationRetries,
  confirmLivenessUpload
} from '../controllers/liveness.controller';

const router = Router();
const upload = multer();

router.post('/create-liveness-session', createLivenessSession);
router.get('/get-liveness-results/:sessionId', getLivenessResults);
router.get('/verification/retries/:projectId/:userId', verificationRetries);
router.post('/verification/:projectId/upload-liveness', upload.none(), verificationLivenessUpload);
router.get('/verification/:projectId/liveness-callback', confirmLivenessUpload);

export default router;