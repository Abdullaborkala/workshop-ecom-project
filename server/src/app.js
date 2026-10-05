import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

export default app;
