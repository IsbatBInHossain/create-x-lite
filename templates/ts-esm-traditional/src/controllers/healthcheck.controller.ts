import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
};
