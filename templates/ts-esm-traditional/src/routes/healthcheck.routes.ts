import { Router } from 'express';
import { getHealth } from '../controllers/healthcheck.controller.js';

const router = Router();

router.get('/', getHealth);

export default router;
