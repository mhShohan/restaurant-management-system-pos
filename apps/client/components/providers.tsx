'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@workspace/ui/components/sonner';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

const defaultOptions = {
  queries: { retry: 1, refetchOnWindowFocus: false },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions }));

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      storageKey='restaurant-pos-theme'
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position='bottom-right' richColors duration={2000} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
