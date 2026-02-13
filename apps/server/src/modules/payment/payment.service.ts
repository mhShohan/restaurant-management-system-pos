import AppError from '@utils/errorHandler/AppError';
import { endOfDay, startOfDay } from 'date-fns';

import Payment, { type IPayment } from './payment.model';
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from './payment.validators';

export const paymentService = {
  async getAll(): Promise<IPayment[]> {
    return Payment.find()
      .populate('order')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Promise<IPayment[]>;
  },

  async getById(id: string): Promise<IPayment> {
    const payment = await Payment.findById(id)
      .populate('order')
      .populate('createdBy', 'name email role');
    if (!payment) throw new AppError(404, 'Payment not found', 'NOT_FOUND');
    return payment;
  },

  async getByOrder(orderId: string): Promise<IPayment | null> {
    const payment = await Payment.findOne({ order: orderId })
      .populate('order')
      .populate('createdBy', 'name email role');
    return payment;
  },

  async getToday(): Promise<IPayment[]> {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    return Payment.find({ createdAt: { $gte: start, $lte: end } })
      .populate('order')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Promise<IPayment[]>;
  },

  async getSummaryByMethod(
    startDate?: string,
    endDate?: string
  ): Promise<{ method: string; total: number; count: number }[]> {
    const match: Record<string, unknown> = { status: 'completed' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate)
        (match.createdAt as Record<string, Date>).$gte = startOfDay(
          new Date(startDate)
        );
      if (endDate)
        (match.createdAt as Record<string, Date>).$lte = endOfDay(
          new Date(endDate)
        );
    }
    const result = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$method',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $project: { method: '$_id', total: 1, count: 1, _id: 0 } },
    ]);
    return result;
  },

  async create(data: CreatePaymentInput, userId: string): Promise<IPayment> {
    const payment = await Payment.create({
      order: data.orderId,
      amount: data.amount,
      method: data.method,
      status: 'completed',
      transactionId: data.transactionId,
      notes: data.notes,
      createdBy: userId,
    });
    const populated = await Payment.findById(payment._id)
      .populate('order')
      .populate('createdBy', 'name email role');
    return populated!;
  },

  async update(id: string, data: UpdatePaymentInput): Promise<IPayment> {
    const payment = await Payment.findByIdAndUpdate(id, data, { new: true })
      .populate('order')
      .populate('createdBy', 'name email role');
    if (!payment) throw new AppError(404, 'Payment not found', 'NOT_FOUND');
    return payment;
  },
};
