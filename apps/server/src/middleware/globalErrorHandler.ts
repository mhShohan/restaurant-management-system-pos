import { config } from '@config';
import { ApiResponse } from '@lib/ApiResponse';
import AppError from '@utils/errorHandler/AppError';
import handleCustomError from '@utils/errorHandler/handleCustomError';
import zodErrorSanitize from '@utils/errorHandler/zodErrorSanitize';
import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error!';
  let errors: Record<string, { path: string; message: string }> = {};

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = handleCustomError(err);
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = zodErrorSanitize(err);
  } else if (
    err.name === 'CastError' &&
    (err as mongoose.CastError).kind === 'ObjectId'
  ) {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (
    err.name === 'MongoServerError' &&
    (err as { code?: number }).code === 11000
  ) {
    statusCode = 409;
    message = 'Duplicate value';
  }

  const errorResponse = {
    statusCode,
    message,
    errors,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  };

  ApiResponse.error(res, errorResponse);
};

export default globalErrorHandler;
