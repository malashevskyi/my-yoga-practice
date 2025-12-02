import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import type { Video } from "../types/video";

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .returns<Video[]>();

  if (error) {
    toast.error("Failed to load videos.");
    console.error("Error fetching videos:", error);
    throw error;
  }

  return data || [];
}
