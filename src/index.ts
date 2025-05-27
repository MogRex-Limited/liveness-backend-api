import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
} from '@aws-sdk/client-rekognition';

import { fromIni } from '@aws-sdk/credential-providers';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: fromIni({ profile: process.env.AWS_PROFILE }),
});

app.post('/create-liveness-session', async (req, res) => {
  try {
    const input = {
      // ClientRequestToken: `session-${Date.now()}`,
      Settings: {
        OutputConfig: {
          S3Bucket: process.env.S3_BUCKET,
          S3KeyPrefix: process.env.S3_KEY_PREFIX,
        },
        AuditImagesLimit: 2,
      },
    };

    const command = new CreateFaceLivenessSessionCommand(input);
    const response = await client.send(command);

    res.json({ sessionId: response.SessionId });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.get('/get-liveness-results/:sessionId', async (req, res) => {
  try {
    const command = new GetFaceLivenessSessionResultsCommand({
      SessionId: req.params.sessionId,
    });

    const response = await client.send(command);
    res.json(response);
  } catch (err) {
    console.error('Error getting results:', err);
    res.status(500).json({ error: err.message });
  }
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`Liveness Server running on http://localhost:${port}`);
});
