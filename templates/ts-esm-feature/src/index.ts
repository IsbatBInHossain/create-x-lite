import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthcheckRouter from './features/healthcheck/healthcheck.routes.js';

const app = express();
const port = process.env.PORT || 3000;

// Basic Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
app.use('/api/v1/healthcheck', healthcheckRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
