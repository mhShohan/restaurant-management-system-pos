'use client';

import type { ApiResponse, RestaurantSettings } from '@/lib/types';

import apiClient from './client';

export const settingsApi = {
  get: async (): Promise<ApiResponse<RestaurantSettings>> => {
    const res =
      await apiClient.get<ApiResponse<RestaurantSettings>>('/settings');
    return res.data;
  },
  update: async (data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxPercentage?: number;
    serviceChargePercentage?: number;
    currency?: string;
  }): Promise<ApiResponse<RestaurantSettings>> => {
    const res = await apiClient.put<ApiResponse<RestaurantSettings>>(
      '/settings',
      data
    );
    return res.data;
  },
  initialize: async (): Promise<ApiResponse<RestaurantSettings>> => {
    const res = await apiClient.post<ApiResponse<RestaurantSettings>>(
      '/settings/initialize'
    );
    return res.data;
  },
};
