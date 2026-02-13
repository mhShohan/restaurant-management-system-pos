import BaseController from '@Base/BaseController';

import { authService } from './auth.service';
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from './auth.validators';

class AuthController extends BaseController {
  login = this.asyncHandler(async (req, res) => {
    const result = await authService.login(req.body as LoginInput);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Login successful',
      data: result,
    });
  });

  register = this.asyncHandler(async (req, res) => {
    const result = await authService.register(req.body as RegisterInput);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'User registered successfully',
      data: result,
    });
  });

  getProfile = this.asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user!._id);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Profile fetched successfully',
      data: user,
    });
  });

  updateProfile = this.asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(
      req.user!._id,
      req.body as UpdateProfileInput
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Profile updated successfully',
      data: user,
    });
  });

  logout = this.asyncHandler(async (_req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Logged out successfully',
      data: null,
    });
  });

  verifyToken = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Token verified successfully',
      data: { user: req.user },
    });
  });

  refreshToken = this.asyncHandler(async (_req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Use login to get a new token',
      data: null,
    });
  });
}

const authController = new AuthController();
export default authController;
