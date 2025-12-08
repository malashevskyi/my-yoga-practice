import { Box, Typography, List, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DEFAULT_PRESETS } from "../../../data/defaultPresets";
import type { TimerStep } from "../../../types/timer";
import { PresetListItem } from "../PresetListItem";

interface DefaultPresetsListProps {
  onSelectPreset: (steps: TimerStep[]) => void;
  isPresetActive: (steps: TimerStep[]) => boolean;
}

export function DefaultPresetsList({
  onSelectPreset,
  isPresetActive,
}: DefaultPresetsListProps) {
  const { t } = useTranslation();
  const [showDefaultPresets, setShowDefaultPresets] = useState(false);

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setShowDefaultPresets(!showDefaultPresets)}
        fullWidth
      >
        {showDefaultPresets
          ? t("presets.hideDefaultPresets")
          : t("presets.showDefaultPresets")}
      </Button>

      {showDefaultPresets && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 2, textAlign: "left" }}
          >
            {t("presets.defaultPresetsTitle")}
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
        </Box>
      )}
    </Box>
  );
}
