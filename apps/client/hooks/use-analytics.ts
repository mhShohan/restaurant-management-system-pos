'use client';

import { dashboardApi } from '@/lib/api';

import { useQuery } from '@tanstack/react-query';

export function useRevenueTrend(days: number = 7) {
  return useQuery({
    queryKey: ['analytics', 'revenue-trend', days],
    queryFn: async () => {
      const res = await dashboardApi.getRevenueTrend(days);
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useSalesByCategory() {
  return useQuery({
    queryKey: ['analytics', 'sales-by-category'],
    queryFn: async () => {
      const res = await dashboardApi.getSalesByCategory();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useRevenueByPaymentMethod() {
  return useQuery({
    queryKey: ['analytics', 'revenue-by-payment'],
    queryFn: async () => {
      const res = await dashboardApi.getRevenueByPaymentMethod();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useHourlyOrders(date?: string) {
  return useQuery({
    queryKey: ['analytics', 'hourly-orders', date],
    queryFn: async () => {
      const res = await dashboardApi.getHourlyOrders(date);
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useTopSellingItems(limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-items', limit],
    queryFn: async () => {
      const res = await dashboardApi.getTopSellingItems(limit);
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useOrderTypeDistribution() {
  return useQuery({
    queryKey: ['analytics', 'order-type'],
    queryFn: async () => {
      const res = await dashboardApi.getOrderTypeDistribution();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useWeeklyComparison() {
  return useQuery({
    queryKey: ['analytics', 'weekly-comparison'],
    queryFn: async () => {
      const res = await dashboardApi.getWeeklyComparison();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}

export function useOrderStatsByStatus() {
  return useQuery({
    queryKey: ['analytics', 'order-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getOrderStatsByStatus();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
  });
}
