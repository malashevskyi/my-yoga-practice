import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePreset } from "../api/presets";

export function useDeletePreset() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  return mutation;
}
