import {
  Drawer,
  IconButton,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSettingsStore } from "../../../store/settingsStore";
import { useDrawerStore } from "../../../store/drawerStore";
import { useAuthStore } from "../../../store/authStore";
import { useUpdateUserSettings } from "../../../hooks/useUpdateUserSettings";

export function SettingsDrawer() {
  const { t } = useTranslation();
  const isOpen = useDrawerStore((state) => state.isSettingsDrawerOpen);
  const setIsOpen = useDrawerStore((state) => state.setSettingsDrawerOpen);
  const autoDimEnabled = useSettingsStore((state) => state.autoDimEnabled);
  const setAutoDimEnabled = useSettingsStore(
    (state) => state.setAutoDimEnabled,
  );
  const userSettings = useAuthStore((state) => state.userSettings);

  // Track if we've initialized from userSettings
  const [initialized, setInitialized] = useState(false);

  // Initialize state
  const [trackingProjectName, setTrackingProjectName] = useState("");
  const [clockifyApiKey, setClockifyApiKey] = useState("");
  const [clockifyWorkspaceId, setClockifyWorkspaceId] = useState("");

  // Initialize from userSettings once they're loaded
  if (userSettings && !initialized) {
    setTrackingProjectName(userSettings.trackingProjectName || "");
    setClockifyApiKey(userSettings.clockifyApiKey || "");
    setClockifyWorkspaceId(userSettings.clockifyWorkspaceId || "");
    setInitialized(true);
  }

  const updateProjectMutation = useUpdateUserSettings();

  // Check if settings have changed
  const hasChanges =
    trackingProjectName.trim() !== (userSettings?.trackingProjectName || "") ||
    clockifyApiKey.trim() !== (userSettings?.clockifyApiKey || "") ||
    clockifyWorkspaceId.trim() !== (userSettings?.clockifyWorkspaceId || "");

  const handleSaveProject = () => {
    const trimmedProject = trackingProjectName.trim();
    const trimmedApiKey = clockifyApiKey.trim();
    const trimmedWorkspaceId = clockifyWorkspaceId.trim();

    if (!trimmedProject || !trimmedApiKey || !trimmedWorkspaceId) {
      toast.error(t("settings.allFieldsRequired"));
      return;
    }

    updateProjectMutation.mutate({
      tracking_project_name: trimmedProject,
      clockify_api_key: trimmedApiKey,
      clockify_workspace_id: trimmedWorkspaceId,
    });
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleAutoDimChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoDimEnabled(event.target.checked);
  };

  return (
    <>
      {/* Settings Button */}
      <IconButton
        onClick={toggleDrawer}
        size="large"
        sx={{
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected",
          },
        }}
      >
        <SettingsIcon />
      </IconButton>

      {/* Settings Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            maxWidth: 400,
            width: "100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">{t("settings.title")}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Settings Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("settings.displaySettings")}
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={autoDimEnabled}
                  onChange={handleAutoDimChange}
                />
              }
              label={
                <Box pl={2}>
                  <Typography variant="body1">
                    {t("settings.autoDimTitle")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("settings.autoDimDescription")}
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary">
              {t("settings.brightnessNote")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Clockify Integration */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("settings.trackingSettings")}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={t("settings.clockifyApiKey")}
                type="password"
                value={clockifyApiKey}
                onChange={(e) => setClockifyApiKey(e.target.value)}
                placeholder={t("settings.clockifyApiKeyPlaceholder")}
                helperText={t("settings.clockifyApiKeyHelp")}
                disabled={updateProjectMutation.isPending}
                autoComplete="off"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={t("settings.clockifyWorkspaceId")}
                value={clockifyWorkspaceId}
                onChange={(e) => setClockifyWorkspaceId(e.target.value)}
                placeholder={t("settings.clockifyWorkspaceIdPlaceholder")}
                helperText={t("settings.clockifyWorkspaceIdHelp")}
                disabled={updateProjectMutation.isPending}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={t("settings.clockifyProject")}
                value={trackingProjectName}
                onChange={(e) => setTrackingProjectName(e.target.value)}
                placeholder={t("settings.clockifyProjectPlaceholder")}
                helperText={t("settings.clockifyProjectHelp")}
                disabled={updateProjectMutation.isPending}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleSaveProject}
              disabled={
                updateProjectMutation.isPending ||
                !trackingProjectName.trim() ||
                !clockifyApiKey.trim() ||
                !clockifyWorkspaceId.trim() ||
                !hasChanges
              }
              startIcon={
                updateProjectMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : null
              }
              sx={{ textTransform: "none" }}
            >
              {updateProjectMutation.isPending
                ? t("settings.saving")
                : t("settings.saveProject")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
