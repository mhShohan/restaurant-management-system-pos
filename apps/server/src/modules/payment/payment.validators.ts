import { z } from 'zod';

const methodEnum = z.enum(['cash', 'card', 'upi']);
const statusEnum = z.enum(['pending', 'completed', 'failed', 'refunded']);

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  method: methodEnum,
  transactionId: z.string().trim().optional(),
  notes: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  status: statusEnum.optional(),
  transactionId: z.string().trim().optional(),
  notes: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
