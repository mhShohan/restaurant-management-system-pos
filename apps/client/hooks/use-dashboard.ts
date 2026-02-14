'use client';

import { dashboardApi } from '@/lib/api';

import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useTodayOrders() {
  return useQuery({
    queryKey: ['orders', 'today'],
    queryFn: async () => {
      const { ordersApi } = await import('@/lib/api');
      const res = await ordersApi.getToday();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useActiveOrders() {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: async () => {
      const { ordersApi } = await import('@/lib/api');
      const res = await ordersApi.getActive();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}
