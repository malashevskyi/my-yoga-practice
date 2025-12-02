import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { VideoPlayer } from "../VideoPlayer";
import type { Video } from "../../../types/video";
import type { VideoPlayerRef } from "../VideoPlayer";
import { useRef, useEffect } from "react";

interface VideoDialogProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export function VideoDialog({ video, open, onClose }: VideoDialogProps) {
  const playerRef = useRef<VideoPlayerRef>(null);
  const prevOpenRef = useRef(open);

  // Restart video from beginning when dialog opens
  useEffect(() => {
    if (open && !prevOpenRef.current && playerRef.current) {
      // Dialog just opened - restart from 0:00
      playerRef.current.play();
    } else if (!open && prevOpenRef.current && playerRef.current) {
      // Dialog just closed - pause the video
      playerRef.current.pause();
    }
    prevOpenRef.current = open;
  }, [open]);

  // Handle keyboard controls (spacebar for play/pause)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && playerRef.current) {
        e.preventDefault();
        playerRef.current.togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!video) return null;

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  };

  const videoId = getYouTubeVideoId(video.url);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      keepMounted // Keep player mounted to avoid re-loading video
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          backgroundImage: "none",
          m: 2,
          // Responsive sizing: fit within viewport with 16:9 aspect ratio
          width: "min(90vw, calc((90vh - 32px) * 16 / 9))",
          height: "min(90vh, calc((90vw - 32px) * 9 / 16))",
          maxWidth: "none",
          maxHeight: "none",
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 1,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{ p: 0, "&:first-of-type": { pt: 0 }, height: "100%" }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          {videoId && <VideoPlayer ref={playerRef} videoId={videoId} />}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
