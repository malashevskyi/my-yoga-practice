import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { usePresets } from "../../../hooks/usePresets";
import { useTimerStore } from "../../../store/timerStore";
import { useFavoritePresetStore } from "../../../store/favoritePresetStore";
import { formatTime } from "../../../utils/formatTime";
import { useState } from "react";
import type { TimerStep } from "../../../types/timer";
import { CreatePresetDialog } from "../CreatePresetDialog";
import { useDeletePreset } from "../../../hooks/useDeletePreset";

export function PresetsList() {
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const setQueue = useTimerStore((state) => state.setQueue);
  const queue = useTimerStore((state) => state.queue);
  const favoritePresetId = useFavoritePresetStore(
    (state) => state.favoritePresetId,
  );
  const setFavoritePreset = useFavoritePresetStore(
    (state) => state.setFavoritePreset,
  );

  const { data: presets, isLoading, error } = usePresets();
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
      const preset = presets?.find((p) => p.id === presetId);
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
      const preset = presets?.find((p) => p.id === presetId);
      if (preset) {
        setFavoritePreset(presetId, preset.steps);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t("presets.loadingError")}: {error.message}
      </Alert>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {t("presets.title")}
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ textTransform: "none" }}
        >
          {t("presets.create")}
        </Button>
      </Box>

      {!presets || presets.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          {t("presets.noPresets")}
        </Typography>
      ) : (
        <List>
          {presets.map((preset) => (
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
                    disabled={deleteMutation.isPending}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemButton
                onClick={() => handleSelectPreset(preset.steps)}
                selected={isPresetActive(preset.steps)}
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

      <CreatePresetDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
