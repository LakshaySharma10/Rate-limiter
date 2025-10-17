import { rateLimiter } from './middleware/rateLimiter.js';
import router from './routes/route.js';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config({quiet: true});

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);

const PORT = process.env.PORT;

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
