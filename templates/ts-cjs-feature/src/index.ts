import 'dotenv/config';
import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import healthcheckRouter = require('./features/healthcheck/healthcheck.routes');

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
