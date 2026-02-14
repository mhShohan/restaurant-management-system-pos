'use client';

import { tablesApi } from '@/lib/api';
import type { TableStatus } from '@/lib/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await tablesApi.getAll();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useTable(id: string) {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: async () => {
      const response = await tablesApi.getById(id);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
    enabled: !!id,
  });
}

export function useAvailableTables() {
  return useQuery({
    queryKey: ['tables', 'available'],
    queryFn: async () => {
      const response = await tablesApi.getAvailable();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tableNumber: string; capacity: number }) =>
      tablesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        tableNumber?: string;
        capacity?: number;
        status?: TableStatus;
      };
    }) => tablesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
