import 'dotenv/config';
import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import healthcheckRouter = require('./routes/healthcheck.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1/healthcheck', healthcheckRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
