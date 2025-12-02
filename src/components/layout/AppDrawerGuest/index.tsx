import {
  Drawer,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDrawerStore } from "../../../store/drawerStore";
import { useTimerStore } from "../../../store/timerStore";
import { DEFAULT_PRESETS } from "../../../data/defaultPresets";
import { formatTime } from "../../../utils/formatTime";
import { LoginButton } from "../../core/LoginButton";

export function AppDrawerGuest() {
  const { t } = useTranslation();

  const isOpen = useDrawerStore((state) => state.isOpen);
  const setIsOpen = useDrawerStore((state) => state.setIsOpen);
  const setQueue = useTimerStore((state) => state.setQueue);
  const queue = useTimerStore((state) => state.queue);

  // Auto-select first preset if no preset is selected
  useEffect(() => {
    if (queue.length === 0 && DEFAULT_PRESETS.length > 0) {
      setQueue(DEFAULT_PRESETS[0].steps);
    }
  }, [queue.length, setQueue]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectPreset = (
    presetSteps: (typeof DEFAULT_PRESETS)[0]["steps"],
  ) => {
    setQueue(presetSteps);
  };

  // Check if current queue matches a preset
  const isPresetActive = (
    presetSteps: (typeof DEFAULT_PRESETS)[0]["steps"],
  ) => {
    if (queue.length !== presetSteps.length) return false;
    return queue.every((step, index) => step.id === presetSteps[index].id);
  };

  return (
    <>
      {/* Menu Button */}
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
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
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
            <Typography variant="h6">{t("menu.presets")}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Presets List */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
            <List>
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
          </Box>

          {/* Login Prompt */}
          <Box
            sx={{
              p: 3,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
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
      </Drawer>
    </>
  );
}
