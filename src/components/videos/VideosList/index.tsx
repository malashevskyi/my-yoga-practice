import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoDialog } from "../VideoDialog";
import { CreateVideoDialog } from "../CreateVideoDialog";
import { useVideos } from "../../../hooks/useVideos";
import type { Video } from "../../../types/video";

export function VideosList() {
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: videos = [], isLoading, error } = useVideos();

  const handleVideoClick = (video: Video) => {
    setActiveVideo(video);
    setIsVideoDialogOpen(true);
  };

  const handleCloseVideoDialog = () => {
    setIsVideoDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

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
      {/* Create Video Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleOpenCreateDialog}
        >
          {t("videos.addVideo")}
        </Button>
      </Box>

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
        open={isVideoDialogOpen}
        onClose={handleCloseVideoDialog}
      />

      <CreateVideoDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </>
  );
}
