'use client';

import type { ApiResponse, AuthResponse, LoginInput, User } from '@/lib/types';

import apiClient from './client';

export const authApi = {
  login: async (data: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return res.data;
  },
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return res.data;
  },
  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return res.data;
  },
  updateProfile: async (data: {
    name?: string;
    email?: string;
  }): Promise<ApiResponse<User>> => {
    const res = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return res.data;
  },
};
