import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePreset } from "../api/presets";

export function useDeletePreset() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      toast.success("Preset deleted successfully");
    },
    onError: (error) => {
      console.error("❌ Error deleting preset:", error);
      toast.error("Failed to delete preset");
    },
  });

  return mutation;
}
