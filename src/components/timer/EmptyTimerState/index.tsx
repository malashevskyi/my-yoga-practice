import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useTimerStore } from "../../../store/timerStore";
import { useFavoritePresetStore } from "../../../store/favoritePresetStore";
import { usePresets } from "../../../hooks/usePresets";
import { useDeletePreset } from "../../../hooks/useDeletePreset";
import { DEFAULT_PRESETS } from "../../../data/defaultPresets";
import { formatTime } from "../../../utils/formatTime";
import { LoginButton } from "../../core/LoginButton";
import { CreatePresetDialog } from "../../presets/CreatePresetDialog";
import type { TimerStep } from "../../../types/timer";

export function EmptyTimerState() {
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const setQueue = useTimerStore((state) => state.setQueue);
  const queue = useTimerStore((state) => state.queue);
  const favoritePresetId = useFavoritePresetStore(
    (state) => state.favoritePresetId,
  );
  const setFavoritePreset = useFavoritePresetStore(
    (state) => state.setFavoritePreset,
  );

  // For authenticated users - fetch their presets
  const { data: userPresets, isLoading, error } = usePresets();
  const deleteMutation = useDeletePreset();

  const handleSelectPreset = (presetSteps: TimerStep[]) => {
    setQueue(presetSteps);
  };

  // Check if current queue matches a preset
  const isPresetActive = (presetSteps: TimerStep[]) => {
    if (queue.length !== presetSteps.length) return false;
    return queue.every((step, index) => step.id === presetSteps[index].id);
  };

  const handleDeletePreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    if (confirm(t("presets.deleteConfirm"))) {
      // If deleting favorite preset, clear it
      if (presetId === favoritePresetId) {
        setFavoritePreset(null, null);
      }

      // If deleting active preset, clear the queue
      const preset = userPresets?.find((p) => p.id === presetId);
      if (preset && isPresetActive(preset.steps)) {
        setQueue([]);
      }

      deleteMutation.mutate(presetId);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    if (favoritePresetId === presetId) {
      setFavoritePreset(null, null);
    } else {
      const preset = userPresets?.find((p) => p.id === presetId);
      if (preset) {
        setFavoritePreset(presetId, preset.steps);
      }
    }
  };

  // Guest user - show default presets
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          pt: 25,
          pb: 4,
          px: 3,
          maxWidth: 600,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          {t("menu.presets")}
        </Typography>

        <List sx={{ width: "100%" }}>
          {DEFAULT_PRESETS.map((preset) => (
            <ListItem key={preset.id} disablePadding>
              <ListItemButton
                onClick={() => handleSelectPreset(preset.steps)}
                selected={isPresetActive(preset.steps)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={t(`defaultPresets.${preset.name}`)}
                  secondary={
                    <>
                      {preset.description && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {preset.description}
                          <br />
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {preset.steps.length} {t("presets.steps")} •{" "}
                        {t("presets.total")}:{" "}
                        {formatTime(preset.duration_total)}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Login Prompt */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            bgcolor: "action.hover",
            width: "100%",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            {t("guest.loginPromptTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("guest.loginPromptFeatures")}:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              {t("guest.featureCreatePresets")}
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              {t("guest.featureAddVideos")}
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              {t("guest.featureHistory")}
            </Typography>
          </Box>
          <LoginButton variant="contained" fullWidth />
        </Box>
      </Box>
    );
  }

  // Authenticated user - show their presets
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          pt: 25,
          pb: 4,
          px: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {t("presets.loadingError")}: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          pt: 25,
          pb: 4,
          px: 3,
          maxWidth: 600,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          {t("menu.presets")}
        </Typography>

        <Box sx={{ width: "100%", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            {t("presets.create")}
          </Button>
        </Box>

        {!userPresets || userPresets.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {t("presets.noPresets")}
          </Typography>
        ) : (
          <List sx={{ width: "100%" }}>
            {userPresets.map((preset) => (
              <ListItem
                key={preset.id}
                disablePadding
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      edge="end"
                      aria-label="favorite"
                      onClick={(e) => handleToggleFavorite(e, preset.id)}
                      color={
                        favoritePresetId === preset.id ? "primary" : "default"
                      }
                    >
                      {favoritePresetId === preset.id ? (
                        <StarIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeletePreset(e, preset.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemButton
                  onClick={() => handleSelectPreset(preset.steps)}
                  selected={isPresetActive(preset.steps)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={preset.name}
                    secondary={
                      <>
                        {preset.description && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {preset.description}
                            <br />
                          </Typography>
                        )}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {preset.steps.length} {t("presets.steps")} •{" "}
                          {t("presets.total")}:{" "}
                          {formatTime(preset.duration_total)}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <CreatePresetDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
