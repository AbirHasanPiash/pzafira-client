import { SWRConfig } from "swr";
import fetcher from "./api/fetcher";

const CACHE_KEY = "pzafira:swr-cache";
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours
const MAX_ENTRIES = 60;

/**
 * Only public catalogue responses are written to disk.
 *
 * Cart, orders, wishlist and profile data stay in memory: persisting them would
 * leave one user's data readable on a shared device and could show stale
 * personal data after a login as a different account.
 */
const PERSISTABLE = ["/products/api/"];

const isPersistable = (key) =>
  typeof key === "string" && PERSISTABLE.some((prefix) => key.startsWith(prefix));

/**
 * Seeds the SWR cache from localStorage on boot and writes it back on unload.
 *
 * The effect is stale-while-revalidate across sessions: a returning visitor
 * sees the previous catalogue immediately on first paint, while SWR refetches
 * in the background and swaps in fresh data when it lands.
 */
let cache = null;

const localStorageProvider = () => {
  // Built once per page load: StrictMode's double render must not register a
  // second set of listeners or discard a warm cache.
  if (cache) return cache;

  const map = new Map();

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { timestamp, entries } = JSON.parse(raw);
      if (Date.now() - timestamp < CACHE_TTL && Array.isArray(entries)) {
        for (const [key, data] of entries) map.set(key, { data });
      } else {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  } catch {
    // Corrupt or unreadable cache: start clean rather than fail the boot.
    localStorage.removeItem(CACHE_KEY);
  }

  const persist = () => {
    try {
      const entries = [...map.entries()]
        .filter(([key, value]) => isPersistable(key) && value?.data && !value.error)
        .slice(-MAX_ENTRIES)
        .map(([key, value]) => [key, value.data]);

      if (!entries.length) return;
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), entries })
      );
    } catch {
      // Over quota or private mode — the in-memory cache still works.
    }
  };

  // `pagehide` fires reliably on mobile Safari, where `beforeunload` does not.
  window.addEventListener("pagehide", persist);
  window.addEventListener("freeze", persist);

  // A session change must not leave the next user looking at cached responses.
  window.addEventListener("user-logged-out", () => {
    map.clear();
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      /* nothing to clean up */
    }
  });

  cache = map;
  return map;
};

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        provider: localStorageProvider,
        revalidateOnFocus: false,
        revalidateIfStale: true, // show cached data first, refresh behind it
        dedupingInterval: 1000 * 60 * 5,
        focusThrottleInterval: 1000 * 60,
        keepPreviousData: true, // no flash of empty state between pages
        errorRetryCount: 2,
        errorRetryInterval: 3000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
