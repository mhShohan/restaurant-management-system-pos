'use client';

import type {
  ApiResponse,
  CreateOrderInput,
  Order,
  OrderStatus,
  OrderType,
} from '@/lib/types';

import apiClient from './client';

export const ordersApi = {
  getAll: async (filters?: {
    status?: OrderStatus;
    orderType?: OrderType;
    tableId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.orderType) params.append('orderType', filters.orderType);
    if (filters?.tableId) params.append('tableId', filters.tableId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const res = await apiClient.get<ApiResponse<Order[]>>(
      `/orders?${params.toString()}`
    );
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data;
  },
  getActive: async (): Promise<ApiResponse<Order[]>> => {
    const res = await apiClient.get<ApiResponse<Order[]>>('/orders/active');
    return res.data;
  },
  getToday: async (): Promise<ApiResponse<Order[]>> => {
    const res = await apiClient.get<ApiResponse<Order[]>>('/orders/today');
    return res.data;
  },
  create: async (data: CreateOrderInput): Promise<ApiResponse<Order>> => {
    const res = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return res.data;
  },
  update: async (
    id: string,
    data: {
      status?: OrderStatus;
      items?: { menuItemId: string; quantity: number; notes?: string }[];
      discountAmount?: number;
      notes?: string;
    }
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.put<ApiResponse<Order>>(`/orders/${id}`, data);
    return res.data;
  },
  updateStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    );
    return res.data;
  },
  cancel: async (id: string): Promise<ApiResponse<Order>> => {
    const res = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/cancel`
    );
    return res.data;
  },
};
