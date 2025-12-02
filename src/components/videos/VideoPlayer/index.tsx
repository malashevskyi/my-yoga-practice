import { Box } from "@mui/material";
import { useEffect } from "react";
import { useYouTubePlayer } from "../../../hooks/useYouTubePlayer";

interface VideoPlayerProps {
  videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const { containerId, stop } = useYouTubePlayer({
    videoId,
    autoplay: true,
  });

  useEffect(() => {
    return () => {
      // Stop video when component unmounts
      stop();
    };
  }, [stop]);

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
