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
  url: string;
  local_name: string | null;
  created_at: string;
}

interface CreateVideoData {
  title: string;
  url: string;
}

export const createVideo = onCall(
  { secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const { title, url } = request.data as CreateVideoData;

    if (!title || !url) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      throw new HttpsError("invalid-argument", "Invalid YouTube URL");
    }

    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("videos")
        .insert({
          id: title,
          user: userId,
          title,
          url,
          local_name: null,
        })
        .select()
        .single<Video>();

      if (error) {
        logger.error("Error creating video:", error);
        throw error;
      }
      return { video: data };
    } catch (error) {
      logger.error("Error creating video:", error);
      throw new HttpsError("internal", "Failed to create video");
    }
  },
);
