import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'carebell-api' });
});

app.get('/api/v1/reminders', (_req, res) => {
  res.json({ reminders: [] });
});

app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);
  if (next) {
    void next;
  }
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
