import { z } from 'zod';

const roleEnum = z.enum(['admin', 'cashier', 'waiter', 'kitchen']);
const statusEnum = z.enum(['active', 'inactive']);

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: roleEnum.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).trim().optional(),
  email: z.string().email().optional(),
  role: roleEnum.optional(),
  status: statusEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
