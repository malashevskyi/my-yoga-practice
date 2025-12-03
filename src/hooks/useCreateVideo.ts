import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVideo } from "../api/videos";

export function useCreateVideo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { title: string; url: string }) => createVideo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video created successfully");
    },
    onError: (error) => {
      console.error("❌ Error creating video:", error);
      toast.error("Failed to create video");
    },
  });

  return mutation;
}
