import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { CreatePresetInput } from "../types/preset";
import { createPreset } from "../api/presets";

export function useCreatePreset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: (input: CreatePresetInput) => createPreset(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      toast.success(t("presets.createSuccess"));
    },
    onError: (error) => {
      console.error("❌ Error creating preset:", error);
      toast.error(t("presets.createError"));
    },
  });

  return mutation;
}
