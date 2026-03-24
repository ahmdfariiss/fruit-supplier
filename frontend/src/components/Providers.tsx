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
      const runFetchUser = () => {
        void fetchUser();
      };

      const hasIdleCallback =
        typeof window !== 'undefined' &&
        typeof window.requestIdleCallback === 'function';

      let idleId: number | undefined;
      let timeoutId: number | undefined;

      if (hasIdleCallback) {
        idleId = window.requestIdleCallback(runFetchUser);
      } else {
        timeoutId = window.setTimeout(runFetchUser, 0);
      }

      return () => {
        if (
          hasIdleCallback &&
          typeof window !== 'undefined' &&
          typeof window.cancelIdleCallback === 'function' &&
          typeof idleId === 'number'
        ) {
          window.cancelIdleCallback(idleId);
          return;
        }

        if (typeof timeoutId === 'number') {
          window.clearTimeout(timeoutId);
        }
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
