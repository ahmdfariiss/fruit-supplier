/**
 * Simple in-memory cache with TTL for public API endpoints.
 * Avoids hitting the database on every request for infrequently-changed data.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

// TTL constants
export const TTL = {
  SHORT: 2 * 60 * 1000,   // 2 minutes
  MEDIUM: 5 * 60 * 1000,  // 5 minutes
  LONG: 10 * 60 * 1000,   // 10 minutes
};
