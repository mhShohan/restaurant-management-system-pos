import { z } from 'zod';

const orderTypeEnum = z.enum(['dine_in', 'takeaway']);
const orderStatusEnum = z.enum([
  'pending',
  'preparing',
  'ready',
  'served',
  'completed',
  'cancelled',
]);

const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  orderType: orderTypeEnum,
  tableId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  discountAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1),
        notes: z.string().optional(),
      })
    )
    .optional(),
  discountAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
