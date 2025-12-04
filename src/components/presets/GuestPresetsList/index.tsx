import { Box, Typography, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DEFAULT_PRESETS } from "../../../data/defaultPresets";
import { LoginButton } from "../../core/LoginButton";
import type { TimerStep } from "../../../types/timer";
import { PresetListItem } from "../PresetListItem";

interface GuestPresetsListProps {
  onSelectPreset: (steps: TimerStep[]) => void;
  isPresetActive: (steps: TimerStep[]) => boolean;
}

export function GuestPresetsList({
  onSelectPreset,
  isPresetActive,
}: GuestPresetsListProps) {
  const { t } = useTranslation();

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
          <PresetListItem
            key={preset.id}
            id={preset.id}
            name={preset.name}
            description={preset.description}
            steps={preset.steps}
            durationTotal={preset.duration_total}
            isActive={isPresetActive(preset.steps)}
            onSelect={() => onSelectPreset(preset.steps)}
            isDefaultPreset
          />
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
