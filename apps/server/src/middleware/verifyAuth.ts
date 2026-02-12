import { AuthToken } from '@utils/AuthToken';
import AppError from '@utils/errorHandler/AppError';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const verifyAuth: RequestHandler = async (req, _res, next) => {
  const bearerToken = req.headers.authorization;

  if (bearerToken) {
    const token = bearerToken.split(' ')[1];

    if (token) {
      try {
        const decode = (await AuthToken.verify(token)) as JwtPayload;

        req.user = {
          _id: decode?._id,
          email: decode?.email,
          role: decode?.role,
        };

        next();
      } catch {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Unauthorize! please login',
          'Unauthorize'
        );
      }
    } else {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Unauthorize! please login',
        'Unauthorize'
      );
    }
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Unauthorize! please login',
      'Unauthorize'
    );
  }
};

export default verifyAuth;
