import BaseController from '@Base/BaseController';

import type { TableStatus } from './table.model';
import { tableService } from './table.service';
import type { CreateTableInput, UpdateTableInput } from './table.validators';

class TableController extends BaseController {
  getAll = this.asyncHandler(async (_req, res) => {
    const tables = await tableService.getAll();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Tables fetched successfully',
      data: tables,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const table = await tableService.getById(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Table fetched successfully',
      data: table,
    });
  });

  getAvailable = this.asyncHandler(async (_req, res) => {
    const tables = await tableService.getAvailable();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Available tables fetched successfully',
      data: tables,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const table = await tableService.create(req.body as CreateTableInput);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Table created successfully',
      data: table,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const table = await tableService.update(
      req.params.id as string,
      req.body as UpdateTableInput
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Table updated successfully',
      data: table,
    });
  });

  delete = this.asyncHandler(async (req, res) => {
    await tableService.delete(req.params.id as string);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Table deleted successfully',
      data: null as unknown as void,
    });
  });

  updateStatus = this.asyncHandler(async (req, res) => {
    const table = await tableService.updateStatus(
      req.params.id as string,
      req.body.status as TableStatus
    );

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Table status updated successfully',
      data: table,
    });
  });
}

const tableController = new TableController();
export default tableController;
