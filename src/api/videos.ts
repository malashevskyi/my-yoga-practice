import type { Video } from "../types/video";
import * as firebaseFunctions from "../lib/firebaseFunctions";

export async function getVideos(): Promise<Video[]> {
  const { videos } = await firebaseFunctions.getVideos();
  return videos;
}

export async function createVideo(input: {
  title: string;
  url: string;
}): Promise<Video> {
  const { video } = await firebaseFunctions.createVideo(input);
  return video;
}
