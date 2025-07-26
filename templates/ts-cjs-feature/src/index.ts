require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthcheckRouter = require('./features/healthcheck/healthcheck.routes');

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
