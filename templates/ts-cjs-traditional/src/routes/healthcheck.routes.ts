import { Router } from 'express';
import { getHealth } from '../controllers/healthcheck.controller';

const router = Router();

router.get('/', getHealth);

export default router;
