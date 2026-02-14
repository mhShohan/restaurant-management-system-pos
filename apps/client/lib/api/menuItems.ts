'use client';

import type { ApiResponse, MenuItem } from '@/lib/types';

import apiClient from './client';

export const menuItemsApi = {
  getAll: async (filters?: {
    category?: string;
    isAvailable?: boolean;
    isVeg?: boolean;
    search?: string;
  }): Promise<ApiResponse<MenuItem[]>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isAvailable !== undefined)
      params.append('isAvailable', String(filters.isAvailable));
    if (filters?.isVeg !== undefined)
      params.append('isVeg', String(filters.isVeg));
    if (filters?.search) params.append('search', filters.search);
    const res = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu-items?${params.toString()}`
    );
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<MenuItem>> => {
    const res = await apiClient.get<ApiResponse<MenuItem>>(`/menu-items/${id}`);
    return res.data;
  },
  getByCategory: async (
    categoryId: string
  ): Promise<ApiResponse<MenuItem[]>> => {
    const res = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu-items/category/${categoryId}`
    );
    return res.data;
  },
  create: async (data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    isAvailable?: boolean;
    isVeg?: boolean;
    imageUrl?: string;
  }): Promise<ApiResponse<MenuItem>> => {
    const res = await apiClient.post<ApiResponse<MenuItem>>(
      '/menu-items',
      data
    );
    return res.data;
  },
  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      isAvailable?: boolean;
      isVeg?: boolean;
      imageUrl?: string;
    }
  ): Promise<ApiResponse<MenuItem>> => {
    const res = await apiClient.put<ApiResponse<MenuItem>>(
      `/menu-items/${id}`,
      data
    );
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/menu-items/${id}`);
    return res.data;
  },
  toggleAvailability: async (id: string): Promise<ApiResponse<MenuItem>> => {
    const res = await apiClient.patch<ApiResponse<MenuItem>>(
      `/menu-items/${id}/toggle-availability`
    );
    return res.data;
  },
};
