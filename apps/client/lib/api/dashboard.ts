'use client';

import type { ApiResponse, DashboardStats, SalesReport } from '@/lib/types';

import apiClient from './client';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res =
      await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data;
  },
  getSalesReport: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<SalesReport[]>> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    const res = await apiClient.get<ApiResponse<SalesReport[]>>(
      `/dashboard/sales-report?${params.toString()}`
    );
    return res.data;
  },
  getOrderStatsByStatus: async (): Promise<ApiResponse<unknown[]>> => {
    const res = await apiClient.get<ApiResponse<unknown[]>>(
      '/dashboard/order-stats'
    );
    return res.data;
  },
  getDailySummary: async (date?: string): Promise<ApiResponse<unknown>> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await apiClient.get<ApiResponse<unknown>>(
      `/dashboard/daily-summary?${params.toString()}`
    );
    return res.data;
  },
};
