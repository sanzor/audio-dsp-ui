import { useEffect } from "react";
import { useAuth } from "./UseAuth";

interface UseTokenAutoRefreshOptions {
  /**
   * Whether auto-refreshing is active
   */
  enabled?: boolean;

  /**
   * Interval in milliseconds to refresh token
   * Default: 13 minutes (before token expires)
   */
  interval?: number;
}
export function useTokenAutoRefresh({
  enabled = true,
  interval = 13 * 60 * 1000, // 13 minutes
}: UseTokenAutoRefreshOptions = {}) {
  const { refreshToken } = useAuth();

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const loop = async () => {
      while (active) {
        await new Promise(res => setTimeout(res, interval));

        try {
          await refreshToken();
        } catch (err) {
          console.warn('Auto token refresh failed:', err);
          // You might want to trigger logout or show a warning here
        }
      }
    };

    loop();

    return () => {
      active = false;
    };
  }, [enabled, interval, refreshToken]);
}