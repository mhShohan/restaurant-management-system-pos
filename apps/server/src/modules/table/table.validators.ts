import { z } from 'zod';

const statusEnum = z.enum(['available', 'occupied', 'reserved']);

export const createTableSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required').trim(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
});

export const updateTableSchema = z.object({
  tableNumber: z.string().min(1).trim().optional(),
  capacity: z.number().int().min(1).optional(),
  status: statusEnum.optional(),
});

export const updateStatusSchema = z.object({
  status: statusEnum,
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
