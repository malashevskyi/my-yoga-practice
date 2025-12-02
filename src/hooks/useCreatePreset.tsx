import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreatePresetInput } from "../types/preset";
import { createPreset } from "../api/presets";

export function useCreatePreset() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreatePresetInput) => createPreset(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      toast.success("Preset created successfully");
    },
    onError: (error) => {
      console.error("❌ Error creating preset:", error);
      toast.error("Failed to create preset");
    },
  });

  return mutation;
}
