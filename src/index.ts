import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import livenessRouter from './routes/liveness.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.get('/current/', (req, res) => {
  res.json({ message: "Reached the current path!" });
});

app.use('/api/v1', livenessRouter);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`Liveness Server running on http://${HOST}:${PORT}`);
});
