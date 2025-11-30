import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPresets, createPreset } from "../api/presets";
import type { CreatePresetInput } from "../types/preset";

export function usePresets() {
  const query = useQuery({
    queryKey: ["presets"],
    queryFn: getPresets,
  });

  return query;
}

export function useCreatePreset() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreatePresetInput) => createPreset(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  return mutation;
}
