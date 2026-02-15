'use client';

import { ordersApi } from '@/lib/api';
import type { CreateOrderInput, OrderStatus, OrderType } from '@/lib/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrders(filters?: {
  status?: OrderStatus;
  orderType?: OrderType;
  tableId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const response = await ordersApi.getAll(filters);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await ordersApi.getById(id);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
    enabled: !!id,
  });
}

export function useActiveOrders() {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: async () => {
      const response = await ordersApi.getActive();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useTodayOrders() {
  return useQuery({
    queryKey: ['orders', 'today'],
    queryFn: async () => {
      const response = await ordersApi.getToday();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
