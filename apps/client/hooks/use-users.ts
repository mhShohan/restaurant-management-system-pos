'use client';

import { usersApi } from '@/lib/api';
import type { UserRole, UserStatus } from '@/lib/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsers(filters?: {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await usersApi.getAll(filters);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await usersApi.getById(id);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    }) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        email?: string;
        role?: UserRole;
        status?: UserStatus;
      };
    }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
