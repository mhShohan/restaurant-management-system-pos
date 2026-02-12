import { Response } from 'express';

interface Paginate {
  page: number;
  limit: number;
  totalPage: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface IResponsePaginate<T> {
  statusCode: number;
  message: string;
  paginate: Paginate;
  data: T;
}

interface IError {
  path: string;
  message: string;
}

interface IErrorResponse {
  statusCode: number;
  message: string;
  errors?: Record<string, IError>;
  stack?: string | null;
}

export class ApiResponse {
  static success<T>(res: Response, responses: IResponse<T>) {
    return res.status(responses.statusCode).json({
      statusCode: responses.statusCode,
      success: true,
      message: responses.message,
      data: responses.data,
    });
  }

  static withPagination<T>(res: Response, responses: IResponsePaginate<T>) {
    return res.status(responses.statusCode).json({
      statusCode: responses.statusCode,
      success: true,
      message: responses.message,
      paginate: responses.paginate,
      data: responses.data,
    });
  }

  static error(res: Response, responses: IErrorResponse) {
    return res.status(responses.statusCode).json({
      statusCode: responses.statusCode,
      success: false,
      message: responses.message,
      errors: responses.errors,
      stack: responses.stack || null,
    });
  }
}
