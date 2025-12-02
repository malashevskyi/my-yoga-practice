import {
  Drawer,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "../../../lib/firebase";
import { useDrawerStore } from "../../../store/drawerStore";
import { useTimerStore } from "../../../store/timerStore";
import { DEFAULT_PRESETS } from "../../../data/defaultPresets";
import { formatTime } from "../../../utils/formatTime";

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

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Drawer will automatically switch to authenticated version via AppDrawerWrapper
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Failed to login");
    }
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
            width: 400,
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LoginIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight={600}>
                {t("guest.loginPromptTitle")}
              </Typography>
            </Box>
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
            <Button
              variant="contained"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              {t("guest.signInButton")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
