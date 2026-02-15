'use client';

import type {
  ApiResponse,
  DashboardStats,
  HourlyOrdersItem,
  OrderTypeDistributionItem,
  RevenueByPaymentItem,
  RevenueTrendItem,
  SalesByCategoryItem,
  SalesReport,
  TopSellingItem,
  WeeklyComparison,
} from '@/lib/types';

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
  getOrderStatsByStatus: async (): Promise<
    ApiResponse<{ status: string; count: number }[]>
  > => {
    const res = await apiClient.get<
      ApiResponse<{ status: string; count: number }[]>
    >('/dashboard/order-stats');
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

  // Analytics endpoints
  getRevenueTrend: async (
    days: number = 7
  ): Promise<ApiResponse<RevenueTrendItem[]>> => {
    const res = await apiClient.get<ApiResponse<RevenueTrendItem[]>>(
      `/dashboard/analytics/revenue-trend?days=${days}`
    );
    return res.data;
  },
  getSalesByCategory: async (): Promise<ApiResponse<SalesByCategoryItem[]>> => {
    const res = await apiClient.get<ApiResponse<SalesByCategoryItem[]>>(
      '/dashboard/analytics/sales-by-category'
    );
    return res.data;
  },
  getRevenueByPaymentMethod: async (): Promise<
    ApiResponse<RevenueByPaymentItem[]>
  > => {
    const res = await apiClient.get<ApiResponse<RevenueByPaymentItem[]>>(
      '/dashboard/analytics/revenue-by-payment'
    );
    return res.data;
  },
  getHourlyOrders: async (
    date?: string
  ): Promise<ApiResponse<HourlyOrdersItem[]>> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await apiClient.get<ApiResponse<HourlyOrdersItem[]>>(
      `/dashboard/analytics/hourly-orders?${params.toString()}`
    );
    return res.data;
  },
  getTopSellingItems: async (
    limit: number = 10
  ): Promise<ApiResponse<TopSellingItem[]>> => {
    const res = await apiClient.get<ApiResponse<TopSellingItem[]>>(
      `/dashboard/analytics/top-items?limit=${limit}`
    );
    return res.data;
  },
  getOrderTypeDistribution: async (): Promise<
    ApiResponse<OrderTypeDistributionItem[]>
  > => {
    const res = await apiClient.get<ApiResponse<OrderTypeDistributionItem[]>>(
      '/dashboard/analytics/order-type'
    );
    return res.data;
  },
  getWeeklyComparison: async (): Promise<ApiResponse<WeeklyComparison>> => {
    const res = await apiClient.get<ApiResponse<WeeklyComparison>>(
      '/dashboard/analytics/weekly-comparison'
    );
    return res.data;
  },
};
