'use client';

import type { ApiResponse, Table, TableStatus } from '@/lib/types';

import apiClient from './client';

export const tablesApi = {
  getAll: async (): Promise<ApiResponse<Table[]>> => {
    const res = await apiClient.get<ApiResponse<Table[]>>('/tables');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Table>> => {
    const res = await apiClient.get<ApiResponse<Table>>(`/tables/${id}`);
    return res.data;
  },
  getAvailable: async (): Promise<ApiResponse<Table[]>> => {
    const res = await apiClient.get<ApiResponse<Table[]>>('/tables/available');
    return res.data;
  },
  create: async (data: {
    tableNumber: string;
    capacity: number;
  }): Promise<ApiResponse<Table>> => {
    const res = await apiClient.post<ApiResponse<Table>>('/tables', data);
    return res.data;
  },
  update: async (
    id: string,
    data: { tableNumber?: string; capacity?: number; status?: TableStatus }
  ): Promise<ApiResponse<Table>> => {
    const res = await apiClient.put<ApiResponse<Table>>(`/tables/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/tables/${id}`);
    return res.data;
  },
  updateStatus: async (
    id: string,
    status: TableStatus
  ): Promise<ApiResponse<Table>> => {
    const res = await apiClient.patch<ApiResponse<Table>>(
      `/tables/${id}/status`,
      { status }
    );
    return res.data;
  },
};
