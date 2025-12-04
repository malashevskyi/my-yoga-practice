import { Alert, Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeletePreset } from "../../../hooks/useDeletePreset";
import { usePresets } from "../../../hooks/usePresets";
import { useAuthStore } from "../../../store/authStore";
import { useFavoritePresetStore } from "../../../store/favoritePresetStore";
import { useTimerStore } from "../../../store/timerStore";
import type { TimerStep } from "../../../types/timer";
import { CreatePresetDialog } from "../../presets/CreatePresetDialog";
import { UserPresetsList } from "../../presets/UserPresetsList";
import { GuestPresetsList } from "../../presets/GuestPresetsList";

export function EmptyTimerState() {
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const deleteMutation = useDeletePreset();

  const user = useAuthStore((state) => state.user);
  const setQueue = useTimerStore((state) => state.setQueue);
  const queue = useTimerStore((state) => state.queue);
  const favoritePresetId = useFavoritePresetStore(
    (state) => state.favoritePresetId,
  );
  const { data: userPresets, isLoading, error } = usePresets();

  const setFavoritePreset = useFavoritePresetStore(
    (state) => state.setFavoritePreset,
  );

  const handleSelectPreset = (presetSteps: TimerStep[]) => {
    setQueue(presetSteps);
  };

  const isPresetActive = (presetSteps: TimerStep[]) => {
    if (queue.length !== presetSteps.length) return false;
    return queue.every((step, index) => step.id === presetSteps[index].id);
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

  const handleDeletePreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    if (!confirm(t("presets.deleteConfirm"))) return;

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
  };

  // Guest user - show default presets
  if (!user) {
    return (
      <GuestPresetsList
        onSelectPreset={handleSelectPreset}
        isPresetActive={isPresetActive}
      />
    );
  }

  // Authenticated user - loading state
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

  // Authenticated user - error state
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

  // Authenticated user - show their presets
  return (
    <>
      <UserPresetsList
        presets={userPresets || []}
        favoritePresetId={favoritePresetId}
        onSelectPreset={handleSelectPreset}
        isPresetActive={isPresetActive}
        onToggleFavorite={handleToggleFavorite}
        onDeletePreset={handleDeletePreset}
        onCreatePreset={() => setCreateDialogOpen(true)}
      />

      <CreatePresetDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
