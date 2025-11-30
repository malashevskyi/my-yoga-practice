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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { usePresets } from "../../../hooks/usePresets";
import { useTimerStore } from "../../../store/timerStore";
import { formatTime } from "../../../utils/time";
import { isDevMode } from "../../../lib/supabase";
import { useState } from "react";
import type { TimerStep } from "../../../types/timer";
import { CreatePresetDialog } from "../CreatePresetDialog";

export function PresetsList() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const setQueue = useTimerStore((state) => state.setQueue);

  const { data: presets, isLoading, error } = usePresets();

  const handleSelectPreset = (presetSteps: TimerStep[]) => {
    setQueue(presetSteps);
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
        Failed to load presets: {error.message}
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
          Available Presets
        </Typography>
        {isDevMode && (
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Create
          </Button>
        )}
      </Box>

      {!presets || presets.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No presets available yet.
        </Typography>
      ) : (
        <List>
          {presets.map((preset) => (
            <ListItem key={preset.id} disablePadding>
              <ListItemButton onClick={() => handleSelectPreset(preset.steps)}>
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
                        {preset.steps.length} steps • Total:{" "}
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

      {isDevMode && (
        <CreatePresetDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      )}
    </>
  );
}
