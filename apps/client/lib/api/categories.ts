'use client';

import type { ApiResponse, Category } from '@/lib/types';

import apiClient from './client';

export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const res = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data;
  },
  create: async (data: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Category>> => {
    const res = await apiClient.post<ApiResponse<Category>>(
      '/categories',
      data
    );
    return res.data;
  },
  update: async (
    id: string,
    data: { name?: string; description?: string }
  ): Promise<ApiResponse<Category>> => {
    const res = await apiClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
    return res.data;
  },
};
