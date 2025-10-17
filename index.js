import express from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter.js';
import dotenv from 'dotenv';

dotenv.config({quiet: true});

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.get('/', (req, res) => {
  res.send('API request successful.');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
