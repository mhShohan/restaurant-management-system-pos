import BaseController from '@Base/BaseController';
import AppError from '@utils/errorHandler/AppError';

import { paymentService } from './payment.service';
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from './payment.validators';

class PaymentController extends BaseController {
  getAll = this.asyncHandler(async (_req, res) => {
    const payments = await paymentService.getAll();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Payments fetched successfully',
      data: payments,
    });
  });

  getById = this.asyncHandler(async (req, res) => {
    const payment = await paymentService.getById(req.params.id as string);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Payment fetched successfully',
      data: payment,
    });
  });

  getByOrder = this.asyncHandler(async (req, res) => {
    const payment = await paymentService.getByOrder(
      req.params.orderId as string
    );
    if (!payment) {
      throw new AppError(404, 'Payment not found for this order', 'NOT_FOUND');
    }
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Payment fetched successfully',
      data: payment,
    });
  });

  getToday = this.asyncHandler(async (_req, res) => {
    const payments = await paymentService.getToday();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: "Today's payments fetched successfully",
      data: payments,
    });
  });

  getSummaryByMethod = this.asyncHandler(async (req, res) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const summary = await paymentService.getSummaryByMethod(startDate, endDate);
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Payment summary fetched successfully',
      data: summary,
    });
  });

  create = this.asyncHandler(async (req, res) => {
    const payment = await paymentService.create(
      req.body as CreatePaymentInput,
      req.user!._id
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Payment created successfully',
      data: payment,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const payment = await paymentService.update(
      req.params.id as string,
      req.body as UpdatePaymentInput
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Payment updated successfully',
      data: payment,
    });
  });
}

const paymentController = new PaymentController();
export default paymentController;
