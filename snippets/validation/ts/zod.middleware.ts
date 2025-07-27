import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json(err.flatten().fieldErrors);
      }
    }
  };
