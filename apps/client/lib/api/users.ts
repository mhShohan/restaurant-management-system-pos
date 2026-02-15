'use client';

import type { ApiResponse, User, UserRole, UserStatus } from '@/lib/types';

import apiClient from './client';

export const usersApi = {
  getAll: async (filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  }): Promise<ApiResponse<User[]>> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const res = await apiClient.get<ApiResponse<User[]>>(
      `/users?${params.toString()}`
    );
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },
  create: async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/users', data);
    return res.data;
  },
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      status?: UserStatus;
    }
  ): Promise<ApiResponse<User>> => {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return res.data;
  },
  toggleStatus: async (id: string): Promise<ApiResponse<User>> => {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/toggle-status`
    );
    return res.data;
  },
  getByRole: async (role: UserRole): Promise<ApiResponse<User[]>> => {
    const res = await apiClient.get<ApiResponse<User[]>>(`/users/role/${role}`);
    return res.data;
  },
};
