'use client';

import { settingsApi } from '@/lib/api';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.get();
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      address?: string;
      phone?: string;
      email?: string;
      taxPercentage?: number;
      serviceChargePercentage?: number;
      currency?: string;
    }) => settingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
