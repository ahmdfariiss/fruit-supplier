'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';
import Toast from '@/components/ui/Toast';

function AuthInitializer() {
  const { isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      // Defer auth check to avoid blocking initial render
      const id = requestIdleCallback
        ? requestIdleCallback(() => fetchUser())
        : setTimeout(() => fetchUser(), 100);
      return () => {
        if (typeof cancelIdleCallback !== 'undefined')
          cancelIdleCallback(id as number);
        else clearTimeout(id as ReturnType<typeof setTimeout>);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
      <Toast />
    </QueryClientProvider>
  );
}
