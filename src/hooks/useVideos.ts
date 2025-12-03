import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../api/videos";

export function useVideos() {
  const query = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });

  return query;
}
