import { ZodError } from 'zod';

export const validate = schema => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.flatten().fieldErrors);
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
