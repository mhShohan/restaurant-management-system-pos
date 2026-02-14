'use client';

import type { ApiResponse, CreatePaymentInput, Payment } from '@/lib/types';

import apiClient from './client';

export const paymentsApi = {
  getAll: async (): Promise<ApiResponse<Payment[]>> => {
    const res = await apiClient.get<ApiResponse<Payment[]>>('/payments');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    const res = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data;
  },
  getByOrder: async (orderId: string): Promise<ApiResponse<Payment | null>> => {
    try {
      const res = await apiClient.get<ApiResponse<Payment>>(
        `/payments/order/${orderId}`
      );
      return res.data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404)
        return {
          success: true,
          message: 'No payment for this order',
          data: null,
        };
      throw err;
    }
  },
  getToday: async (): Promise<ApiResponse<Payment[]>> => {
    const res = await apiClient.get<ApiResponse<Payment[]>>('/payments/today');
    return res.data;
  },
  getSummaryByMethod: async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<unknown[]>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await apiClient.get<ApiResponse<unknown[]>>(
      `/payments/summary/by-method?${params.toString()}`
    );
    return res.data;
  },
  create: async (data: CreatePaymentInput): Promise<ApiResponse<Payment>> => {
    const res = await apiClient.post<ApiResponse<Payment>>('/payments', data);
    return res.data;
  },
  update: async (
    id: string,
    data: { status?: string; transactionId?: string; notes?: string }
  ): Promise<ApiResponse<Payment>> => {
    const res = await apiClient.put<ApiResponse<Payment>>(
      `/payments/${id}`,
      data
    );
    return res.data;
  },
};
