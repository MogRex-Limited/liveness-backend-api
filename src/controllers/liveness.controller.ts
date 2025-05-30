import { Request, Response } from 'express';
import {
  createLivenessSessionService,
  getLivenessResultsService,
  verificationRetriesService,
  verificationUploadService,
} from '../services/liveness.service';
import path from "path";

export const createLivenessSession = async (req: Request, res: Response) => {
  try {
    const sessionId = await createLivenessSessionService();
    res.json({ sessionId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLivenessResults = async (req: Request, res: Response) => {
  try {
    const response = await getLivenessResultsService(req.params.sessionId);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verificationRetries = async (req: Request, res: Response) => {
  try {
    const { projectId, userId, activity } = req.params;
    const result = await verificationRetriesService({ projectId, userId, activity });
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
    res.status(500).json({ error: err.message });
  }
};

export const confirmLivenessUpload = async (req: Request, res: Response) => {
  try {
    const viewPath = path.join(__dirname, "../views/verification-complete.html");
    res.sendFile(viewPath);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};