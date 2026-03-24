'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to guard Zustand store reads that would cause hydration mismatches.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
