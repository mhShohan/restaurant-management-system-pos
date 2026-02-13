import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().trim().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().optional(),
  isVeg: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1).trim().optional(),
  description: z.string().trim().optional(),
  price: z.number().min(0).optional(),
  category: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
  isVeg: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
