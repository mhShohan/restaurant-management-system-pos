import { config } from '@config';
import jwt, { SignOptions } from 'jsonwebtoken';

import AppError from './errorHandler/AppError';

export class AuthToken {
  /**
   * Generates a JWT token with the given payload.
   * @param payload
   * @returns  A promise that resolves to the generated token.
   */
  static async generate(payload: Record<string, unknown>) {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET!, {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });
  }

  /**
   * Verifies the given JWT token.
   * @param token - The JWT token to verify.
   * @returns The decoded token payload if the token is valid.
   * @throws An AppError if the token is invalid.
   */
  static async verify(token: string) {
    try {
      return jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch (error) {
      throw new AppError(401, 'Invalid token', 'Unauthorized');
    }
  }
}
