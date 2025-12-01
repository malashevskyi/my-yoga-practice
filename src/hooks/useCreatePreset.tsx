import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePresetInput } from "../types/preset";
import { createPreset } from "../api/presets";

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
