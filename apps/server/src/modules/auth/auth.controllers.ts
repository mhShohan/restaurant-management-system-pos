import BaseController from '@Base/BaseController';

/**
 * AuthController
 * @extends BaseController
 * @implements {asyncHandler}
 * @implements {ApiResponse}
 * @implements {httpStatus}
 * @description AuthController class is used to handle all auth related requests
 */
class AuthController extends BaseController {
  /**
   * Register a new user
   */
  register = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User registered successfully',
      data: req.body,
    });
  });

  /**
   * Login a user
   */
  login = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User logged in successfully',
      data: req.body,
    });
  });

  /**
   * Logout a user
   */
  logout = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User logged out successfully',
      data: req.body,
    });
  });

  /**
   * verify token
   */
  verifyToken = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Token verified successfully',
      data: req.body,
    });
  });

  /**
   * refresh token
   */
  refreshToken = this.asyncHandler(async (req, res) => {
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Token refreshed successfully',
      data: req.body,
    });
  });
}

const authController = new AuthController();
export default authController;
