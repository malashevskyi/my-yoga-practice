import { useQuery } from "@tanstack/react-query";
import { getPresets } from "../api/presets";

export function usePresets() {
  const query = useQuery({
    queryKey: ["presets"],
    queryFn: getPresets,
  });

  return query;
}
