'use client';

import { paymentsApi } from '@/lib/api';
import type { CreatePaymentInput } from '@/lib/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await paymentsApi.getAll();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const response = await paymentsApi.getById(id);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
    enabled: !!id,
  });
}

export function usePaymentByOrder(orderId: string) {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: async () => {
      const response = await paymentsApi.getByOrder(orderId);
      if (response.success) return response.data ?? null;
      throw new Error(response.message);
    },
    enabled: !!orderId,
  });
}

export function useTodayPayments() {
  return useQuery({
    queryKey: ['payments', 'today'],
    queryFn: async () => {
      const response = await paymentsApi.getToday();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function usePaymentSummaryByMethod(
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['payments', 'summary', startDate, endDate],
    queryFn: async () => {
      const response = await paymentsApi.getSummaryByMethod(startDate, endDate);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentInput) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
