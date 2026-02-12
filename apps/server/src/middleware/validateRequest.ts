import { NextFunction, Request, Response } from 'express';

type SchemaLike = { parseAsync: (data: unknown) => Promise<unknown> };

const validateRequest = (schema: SchemaLike) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
