/**
 * Client-side cache for dashboard Google data.
 * Module memory + sessionStorage so leaving /dashboard and returning stays instant.
 */

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const SELECTION_KEY = "mgp.dashboard.selection";
const SIDEBAR_KEY_PREFIX = "mgp.dashboard.sidebar.";
const BUNDLE_KEY_PREFIX = "mgp.dashboard.bundle.";

type CacheEntry<T> = { data: T; at: number };

function isFresh(at: number) {
  return Date.now() - at < TTL_MS;
}

const bundleCache = new Map<string, CacheEntry<unknown>>();
const sidebarCache = new Map<string, CacheEntry<unknown>>();
const sidebarInflight = new Map<string, Promise<unknown>>();

export function bundleCacheKey(accountId: string, locationName: string) {
  return `${accountId}::${locationName}`;
}

function readSession<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed?.at || parsed.data === undefined) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession<T>(key: string, entry: CacheEntry<T>) {
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // quota — ignore
  }
}

export function getCachedBundle<T>(accountId: string, locationName: string): T | null {
  const key = bundleCacheKey(accountId, locationName);
  const mem = bundleCache.get(key);
  if (mem && isFresh(mem.at)) return mem.data as T;

  const stored = readSession<T>(BUNDLE_KEY_PREFIX + key);
  if (stored && isFresh(stored.at)) {
    bundleCache.set(key, stored);
    return stored.data;
  }
  return null;
}

/** Stale-OK peek for instant paint after remount. */
export function peekCachedBundle<T>(accountId: string, locationName: string): T | null {
  const key = bundleCacheKey(accountId, locationName);
  const mem = bundleCache.get(key);
  if (mem) return mem.data as T;
  const stored = readSession<T>(BUNDLE_KEY_PREFIX + key);
  if (stored) {
    bundleCache.set(key, stored);
    return stored.data;
  }
  return null;
}

export function setCachedBundle<T>(accountId: string, locationName: string, data: T) {
  const key = bundleCacheKey(accountId, locationName);
  const entry = { data, at: Date.now() };
  bundleCache.set(key, entry);
  writeSession(BUNDLE_KEY_PREFIX + key, entry);
}

export function getCachedSidebar<T>(userId: string): T | null {
  const mem = sidebarCache.get(userId);
  if (mem && isFresh(mem.at)) return mem.data as T;

  const stored = readSession<T>(SIDEBAR_KEY_PREFIX + userId);
  if (stored && isFresh(stored.at)) {
    sidebarCache.set(userId, stored);
    return stored.data;
  }
  return null;
}

export function peekCachedSidebar<T>(userId: string): T | null {
  const mem = sidebarCache.get(userId);
  if (mem) return mem.data as T;
  const stored = readSession<T>(SIDEBAR_KEY_PREFIX + userId);
  if (stored) {
    sidebarCache.set(userId, stored);
    return stored.data;
  }
  return null;
}

export function isSidebarCacheFresh(userId: string): boolean {
  return getCachedSidebar(userId) !== null;
}

export function setCachedSidebar<T>(userId: string, data: T) {
  const entry = { data, at: Date.now() };
  sidebarCache.set(userId, entry);
  writeSession(SIDEBAR_KEY_PREFIX + userId, entry);
}

export async function withSidebarInflight<T>(
  userId: string,
  loader: () => Promise<T>
): Promise<T> {
  const existing = sidebarInflight.get(userId);
  if (existing) return existing as Promise<T>;

  const promise = loader().finally(() => {
    sidebarInflight.delete(userId);
  });
  sidebarInflight.set(userId, promise);
  return promise;
}

export function invalidateDashboardCache() {
  bundleCache.clear();
  sidebarCache.clear();
  sidebarInflight.clear();
}

export function saveDashboardSelection(selection: {
  accountId: string;
  locationName: string;
}) {
  try {
    sessionStorage.setItem(SELECTION_KEY, JSON.stringify(selection));
  } catch {
    // ignore
  }
}

export function loadDashboardSelection(): {
  accountId: string;
  locationName: string;
} | null {
  try {
    const raw = sessionStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.accountId && parsed?.locationName) return parsed;
  } catch {
    // ignore
  }
  return null;
}
