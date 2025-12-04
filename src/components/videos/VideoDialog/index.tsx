import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { VideoPlayer } from "../VideoPlayer";
import type { Video } from "../../../types/video";
import type { VideoPlayerRef } from "../VideoPlayer";
import { useRef, useEffect, useCallback } from "react";
import { trackCompletedTimer } from "../../../utils/trackTimer";

interface VideoDialogProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

// Extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
};

export function VideoDialog({ video, open, onClose }: VideoDialogProps) {
  const playerRef = useRef<VideoPlayerRef>(null);
  const prevOpenRef = useRef(open);
  const totalWatchTimeRef = useRef<number>(0); // Total seconds watched
  const playStartTimeRef = useRef<number | null>(null); // When video started playing
  const isPlayingRef = useRef<boolean>(false);

  const updateTotalWatchTime = useCallback(() => {
    if (playStartTimeRef.current) {
      // we add time since last play start when the video is paused/stopped or dialog closes
      const playDuration = Math.floor(
        (Date.now() - playStartTimeRef.current) / 1000,
      );
      totalWatchTimeRef.current += playDuration;
    }
    // we need to reset to get a new start time on next play
    playStartTimeRef.current = null;

    // we save total time after pausing/stopping
    isPlayingRef.current = false;

    return totalWatchTimeRef.current;
  }, []);

  // Handle YouTube player state changes (play/pause/buffering)
  const handleStateChange = (state: number) => {
    // YouTube PlayerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
    const isNowPlaying = state === 1; // PLAYING

    if (isNowPlaying && !isPlayingRef.current) {
      // we save time when video starts playing for tracking
      playStartTimeRef.current = Date.now();
      isPlayingRef.current = true;
    } else if (!isNowPlaying && isPlayingRef.current) {
      updateTotalWatchTime();
    }
  };

  const resetTrackingState = useCallback(() => {
    // we reset it when dialog is closed or opened
    totalWatchTimeRef.current = 0;
    playStartTimeRef.current = null;
    isPlayingRef.current = false;
  }, []);

  const handleDialogOpen = useCallback(() => {
    resetTrackingState();

    if (playerRef.current) playerRef.current.play();
  }, [resetTrackingState]);

  const handleDialogClose = useCallback(() => {
    // If video was playing when closed, add that time
    const totalWatchTime = updateTotalWatchTime();

    if (totalWatchTime >= 60) {
      // Track to Clockify (>= 1 minute)
      trackCompletedTimer({
        id: `video-${Date.now()}`,
        type: "video",
        label: video?.title || "Video Watch",
        duration: totalWatchTime,
      });
    }

    resetTrackingState();

    if (playerRef.current) playerRef.current.pause();
  }, [video, updateTotalWatchTime, resetTrackingState]);

  // Track video watch time when dialog opens/closes
  useEffect(() => {
    if (open && !prevOpenRef.current) handleDialogOpen();
    if (!open && prevOpenRef.current) handleDialogClose();
    prevOpenRef.current = open;
  }, [open, handleDialogOpen, handleDialogClose]);

  // Handle keyboard controls (spacebar for play/pause) to fix iframe focus issue
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
        sx={{
          p: 0,
          "&:first-of-type": { pt: 0 },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          {videoId && (
            <VideoPlayer
              ref={playerRef}
              videoId={videoId}
              onStateChange={handleStateChange}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
