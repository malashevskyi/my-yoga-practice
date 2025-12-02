import { useQuery } from "@tanstack/react-query";
import { getPresets } from "../api/presets";
import { useAuthStore } from "../store/authStore";

export function usePresets() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ["presets"],
    queryFn: getPresets,
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  return query;
}
