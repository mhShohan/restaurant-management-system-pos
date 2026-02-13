import BaseController from '@Base/BaseController';

import { menuItemService } from './menuItem.service';
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from './menuItem.validators';

class MenuItemController extends BaseController {
  getAll = this.asyncHandler(async (req, res) => {
    const category = req.query.category as string | undefined;
    const isAvailable = req.query.isAvailable as string | undefined;
    const isVeg = req.query.isVeg as string | undefined;
    const search = req.query.search as string | undefined;
    const filters =
      category || isAvailable !== undefined || isVeg !== undefined || search
        ? {
            category,
            isAvailable:
              isAvailable === 'true'
                ? true
                : isAvailable === 'false'
                  ? false
                  : undefined,
            isVeg:
              isVeg === 'true' ? true : isVeg === 'false' ? false : undefined,
            search,
          }
        : undefined;

    const items = await menuItemService.getAll(filters);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Menu items fetched successfully',
      data: items,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const item = await menuItemService.getById(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Menu item fetched successfully',
      data: item,
    });
  });

  getByCategory = this.asyncHandler(async (req, res) => {
    const items = await menuItemService.getByCategory(
      req.params.categoryId as string
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Menu items fetched successfully',
      data: items,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const item = await menuItemService.create(req.body as CreateMenuItemInput);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Menu item created successfully',
      data: item,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const item = await menuItemService.update(
      req.params.id as string,
      req.body as UpdateMenuItemInput
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Menu item updated successfully',
      data: item,
    });
  });

  delete = this.asyncHandler(async (req, res) => {
    await menuItemService.delete(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Menu item deleted successfully',
      data: null as unknown as void,
    });
  });

  toggleAvailability = this.asyncHandler(async (req, res) => {
    const item = await menuItemService.toggleAvailability(
      req.params.id as string
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Availability toggled successfully',
      data: item,
    });
  });
}

const menuItemController = new MenuItemController();
export default menuItemController;
