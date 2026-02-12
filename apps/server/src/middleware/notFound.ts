import { ApiResponse } from '@lib/ApiResponse';
import { Request, Response } from 'express';

const notFound = (_req: Request, res: Response) => {
  ApiResponse.error(res, {
    statusCode: 404,
    message: '404! Route Not found.',
  });
};

export default notFound;
