import BaseController from '@Base/BaseController';

import { categoryService } from './category.service';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.validators';

class CategoryController extends BaseController {
  getAll = this.asyncHandler(async (_req, res) => {
    const categories = await categoryService.getAll();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Categories fetched successfully',
      data: categories,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const category = await categoryService.getById(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Category fetched successfully',
      data: category,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const category = await categoryService.create(
      req.body as CreateCategoryInput
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Category created successfully',
      data: category,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const category = await categoryService.update(
      req.params.id as string,
      req.body as UpdateCategoryInput
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Category updated successfully',
      data: category,
    });
  });

  delete = this.asyncHandler(async (req, res) => {
    await categoryService.delete(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Category deleted successfully',
      data: null as unknown as void,
    });
  });
}

const categoryController = new CategoryController();
export default categoryController;
