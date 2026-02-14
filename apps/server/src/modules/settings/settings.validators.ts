import { z } from 'zod';

export const updateSettingsSchema = z.object({
  name: z.string().min(1).trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().email().optional(),
  taxPercentage: z.number().min(0).max(100).optional(),
  serviceChargePercentage: z.number().min(0).max(100).optional(),
  currency: z.string().min(1).trim().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
