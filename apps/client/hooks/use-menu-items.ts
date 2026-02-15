'use client';

import { menuItemsApi } from '@/lib/api';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMenuItems(filters?: {
  category?: string;
  isAvailable?: boolean;
  isVeg?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ['menuItems', filters],
    queryFn: async () => {
      const response = await menuItemsApi.getAll(filters);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ['menuItems', id],
    queryFn: async () => {
      const response = await menuItemsApi.getById(id);
      if (response.success && response.data) return response.data;
      throw new Error(response.message);
    },
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      price: number;
      category: string;
      isAvailable?: boolean;
      isVeg?: boolean;
      imageUrl?: string;
    }) => menuItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        price?: number;
        category?: string;
        isAvailable?: boolean;
        isVeg?: boolean;
        imageUrl?: string;
      };
    }) => menuItemsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.id] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useToggleMenuItemAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemsApi.toggleAvailability(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', id] });
    },
  });
}
