import { Request, Response } from 'express';
import {
  createLivenessSessionService,
  getLivenessResultsService,
  verificationRetriesService,
  verificationUploadService,
} from '../services/liveness.service';

export const createLivenessSession = async (req: Request, res: Response) => {
  try {
    const sessionId = await createLivenessSessionService();
    res.json({ sessionId });
  } catch (err: any) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getLivenessResults = async (req: Request, res: Response) => {
  try {
    const response = await getLivenessResultsService(req.params.sessionId);
    res.json(response);
  } catch (err: any) {
    console.error('Error getting results:', err);
    res.status(500).json({ error: err.message });
  }
};

export const verificationRetries = async (req: Request, res: Response) => {
  try {
    const result = await verificationRetriesService(req.params);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verificationLivenessUpload = async (req: Request, res: Response) => {
  try {
    const result = await verificationUploadService(req.body, req.params.projectId);
    res.json(result);
  } catch (err: any) {
    console.log('Error in verification upload:', err);
    res.status(500).json({ error: err.message });
  }
};