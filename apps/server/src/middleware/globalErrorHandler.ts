import { config } from '@config';
import { ApiResponse } from '@lib/ApiResponse';
import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const errorResponse = {
    statusCode: 500,
    message: 'Internal Server Error!',
    errors: {},
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  };

  ApiResponse.error(res, errorResponse);
};

export default globalErrorHandler;
