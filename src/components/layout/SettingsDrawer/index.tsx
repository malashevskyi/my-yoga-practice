import {
  Drawer,
  IconButton,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../../store/settingsStore";

export function SettingsDrawer() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const autoDimEnabled = useSettingsStore((state) => state.autoDimEnabled);
  const setAutoDimEnabled = useSettingsStore(
    (state) => state.setAutoDimEnabled,
  );

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
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
