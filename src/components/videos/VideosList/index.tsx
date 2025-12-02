import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getVideos } from "../../../api/videos";
import { useAuthStore } from "../../../store/authStore";
import { VideoDialog } from "../VideoDialog";
import type { Video } from "../../../types/video";

export function VideosList() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  const handleVideoClick = (video: Video) => {
    setActiveVideo(video);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Don't show loading for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {t("auth.loginRequired")}
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error" align="center">
        {t("videos.loadingError")}
      </Typography>
    );
  }

  return (
    <>
      {videos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          {t("videos.noVideos")}
        </Typography>
      ) : (
        <List>
          {videos.map((video) => (
            <ListItem key={video.id} disablePadding>
              <ListItemButton
                onClick={() => handleVideoClick(video)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <PlayCircleOutlineIcon
                  sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                />
                <ListItemText
                  primary={video.title}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <VideoDialog
        video={activeVideo}
        open={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
