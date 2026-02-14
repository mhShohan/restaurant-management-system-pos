import BaseController from '@Base/BaseController';

import type { OrderStatus } from './order.model';
import { orderService } from './order.service';
import type { CreateOrderInput, UpdateOrderInput } from './order.validators';

class OrderController extends BaseController {
  getAll = this.asyncHandler(async (req, res) => {
    const status = req.query.status as OrderStatus | undefined;
    const orderType = req.query.orderType as 'dine_in' | 'takeaway' | undefined;
    const tableId = req.query.tableId as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const filters =
      status || orderType || tableId || startDate || endDate
        ? { status, orderType, tableId, startDate, endDate }
        : undefined;
    const orders = await orderService.getAll(filters);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Orders fetched successfully',
      data: orders,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const order = await orderService.getById(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order fetched successfully',
      data: order,
    });
  });

  getActive = this.asyncHandler(async (_req, res) => {
    const orders = await orderService.getActive();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Active orders fetched successfully',
      data: orders,
    });
  });

  getToday = this.asyncHandler(async (_req, res) => {
    const orders = await orderService.getToday();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: "Today's orders fetched successfully",
      data: orders,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const order = await orderService.create(
      req.body as CreateOrderInput,
      req.user!._id
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const order = await orderService.update(
      req.params.id as string,
      req.body as UpdateOrderInput
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order updated successfully',
      data: order,
    });
  });

  updateStatus = this.asyncHandler(async (req, res) => {
    const order = await orderService.updateStatus(
      req.params.id as string,
      req.body.status as OrderStatus
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order status updated successfully',
      data: order,
    });
  });

  cancel = this.asyncHandler(async (req, res) => {
    const order = await orderService.cancel(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order cancelled successfully',
      data: order,
    });
  });
}

const orderController = new OrderController();
export default orderController;
