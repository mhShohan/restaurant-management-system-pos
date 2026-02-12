import { ApiResponse } from '@lib/ApiResponse';
import asyncHandler from '@lib/asyncHandler';
import STATUS from '@lib/httpStatus';

/**
 * BaseController
 * @implements {ApiResponse}
 * @implements {httpStatus}
 * @implements {asyncHandler}
 * @description BaseController is used to handle all base controller related requests
 */
class BaseController {
  protected readonly ApiResponse = ApiResponse;
  protected readonly httpStatus = STATUS;
  protected readonly asyncHandler = asyncHandler;
}

export default BaseController;
