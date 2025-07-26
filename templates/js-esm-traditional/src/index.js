import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthcheckRouter from './routes/healthcheck.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1/healthcheck', healthcheckRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
