import { Box } from "@mui/material";
import { useImperativeHandle } from "react";
import { useYouTubePlayer } from "../../../hooks/useYouTubePlayer";

interface VideoPlayerProps {
  videoId: string;
  ref?: React.Ref<VideoPlayerRef>;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  togglePlayPause: () => void;
}

export function VideoPlayer({ videoId, ref }: VideoPlayerProps) {
  const { containerId, stop, play, pause, restart, togglePlayPause } =
    useYouTubePlayer({
      videoId,
      autoplay: true,
    });

  useImperativeHandle(ref, () => ({
    play,
    pause,
    stop,
    restart,
    togglePlayPause,
  }));

  // Don't unmount player - keep it alive for reuse
  // Just pause when dialog closes (handled by parent)

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: "55.35%", // 16:9 aspect ratio
        bgcolor: "black",
        display: "flex",
        backgroundColor: "black",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        id={containerId}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}
