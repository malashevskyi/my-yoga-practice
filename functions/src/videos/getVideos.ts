import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  getSupabaseClient,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../lib/supabase";

interface Video {
  id: string;
  user: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string | null;
  video_duration: number;
  created_at: string;
}

export const getVideos = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user", userId)
        .returns<Video[]>();

      if (error) throw error;
      return { videos: data || [] };
    } catch (error) {
      logger.error("Error fetching videos:", error);
      throw new HttpsError("internal", "Failed to fetch videos");
    }
  },
);
