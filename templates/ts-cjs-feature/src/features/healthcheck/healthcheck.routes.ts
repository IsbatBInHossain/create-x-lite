import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

export = router;
