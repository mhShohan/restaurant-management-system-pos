'use client';

import { authApi } from '@/lib/api';
import type { LoginInput } from '@/lib/types';
import { useAuthStore } from '@/stores';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        queryClient.setQueryData(['user'], response.data.user);
      }
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await authApi.getProfile();
      if (res.success && res.data) return res.data;
      throw new Error(res.message);
    },
    retry: false,
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return () => {
    logout();
    queryClient.clear();
  };
}
