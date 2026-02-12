import { ApiResponse } from '@lib/ApiResponse';
import { NextFunction, Request, Response } from 'express';
import { ZodAny } from 'zod';

const validateRequest = (schema: ZodAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, data, error } = schema.safeParse(req.body);

      console.log(error);

      if (!success) {
        ApiResponse.error(res, {
          statusCode: 400,
          message: 'Validation Error',
          errors: {},
        });
      }

      req.body = data;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
