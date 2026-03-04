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
      fetchUser();
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
