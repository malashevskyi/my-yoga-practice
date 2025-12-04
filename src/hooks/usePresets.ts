import { useQuery } from "@tanstack/react-query";
import { getPresets } from "../api/presets";
import { useAuthStore } from "../store/authStore";

export function usePresets() {
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: ["presets"],
    queryFn: getPresets,
    // we need this as we call getPresets for favorite preset autoload
    enabled: !!user,
  });

  return query;
}
