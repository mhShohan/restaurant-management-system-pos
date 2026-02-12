import BaseController from '@Base/BaseController';
import { userService } from './user.service';
import type { CreateUserInput, UpdateUserInput } from './user.validators';
import type { UserRole } from './user.model';

class UserController extends BaseController {
  getAll = this.asyncHandler(async (req, res) => {
    const role = req.query.role as UserRole | undefined;
    const status = req.query.status as import('./user.model').UserStatus | undefined;
    const search = req.query.search as string | undefined;
    const users = await userService.getAll({ role, status, search });
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User fetched successfully',
      data: user,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const user = await userService.create(req.body as CreateUserInput);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id as string, req.body as UpdateUserInput);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User updated successfully',
      data: user,
    });
  });

  delete = this.asyncHandler(async (req, res) => {
    await userService.delete(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User deleted successfully',
      data: null as unknown as void,
    });
  });

  toggleStatus = this.asyncHandler(async (req, res) => {
    const user = await userService.toggleStatus(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'User status toggled successfully',
      data: user,
    });
  });

  getByRole = this.asyncHandler(async (req, res) => {
    const users = await userService.getByRole((req.params.role as string) as UserRole);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    });
  });
}

const userController = new UserController();
export default userController;
