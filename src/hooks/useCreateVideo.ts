import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createVideo } from "../api/videos";

export function useCreateVideo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: (input: { title: string; url: string }) => createVideo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(t("videos.createSuccess"));
    },
    onError: (error) => {
      console.error("❌ Error creating video:", error);
      toast.error(t("videos.createError"));
    },
  });

  return mutation;
}
