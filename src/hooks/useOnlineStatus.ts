import { useEffect, useState } from "react";
import { onlineManager } from "@tanstack/react-query";

/**
 * Hook to track online/offline status using React Query's onlineManager
 * @returns boolean indicating whether the user is online
 */
export function useOnlineStatus(): boolean {
  // Initialize with current online status
  const [isOnline, setIsOnline] = useState(
    () => navigator.onLine && onlineManager.isOnline(),
  );

  useEffect(() => {
    // Subscribe to online status changes
    const unsubscribe = onlineManager.subscribe((online) => {
      setIsOnline(online && navigator.onLine);
    });

    // Also listen to browser's online/offline events
    const handleOnline = () => setIsOnline(onlineManager.isOnline());
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
