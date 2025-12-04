import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deletePreset } from "../api/presets";

export function useDeletePreset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      toast.success(t("presets.deleteSuccess"));
    },
    onError: (error) => {
      console.error("❌ Error deleting preset:", error);
      toast.error(t("presets.deleteError"));
    },
  });

  return mutation;
}
