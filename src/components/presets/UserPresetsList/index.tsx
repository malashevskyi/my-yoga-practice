import { Box, Typography, List, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Preset } from "../../../types/preset";
import type { TimerStep } from "../../../types/timer";
import { DefaultPresetsList } from "../DefaultPresetsList";
import { UserPresetListItem } from "../UserPresetListItem";

interface UserPresetsListProps {
  presets: Preset[];
  favoritePresetId: string | null;
  onSelectPreset: (steps: TimerStep[]) => void;
  isPresetActive: (steps: TimerStep[]) => boolean;
  onToggleFavorite: (e: React.MouseEvent, presetId: string) => void;
  onDeletePreset: (e: React.MouseEvent, presetId: string) => void;
  onCreatePreset: () => void;
}

export function UserPresetsList({
  presets,
  favoritePresetId,
  onSelectPreset,
  isPresetActive,
  onToggleFavorite,
  onDeletePreset,
  onCreatePreset,
}: UserPresetsListProps) {
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
          onClick={onCreatePreset}
        >
          {t("presets.create")}
        </Button>
      </Box>

      {!presets || presets.length === 0 ? (
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            {t("presets.noPresets")}
          </Typography>
          <DefaultPresetsList
            onSelectPreset={onSelectPreset}
            isPresetActive={isPresetActive}
          />
        </Box>
      ) : (
        <>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 2, width: "100%", textAlign: "left" }}
          >
            {t("presets.yourPresets")}
          </Typography>
          <List sx={{ width: "100%" }}>
            {presets.map((preset) => (
              <UserPresetListItem
                key={preset.id}
                id={preset.id}
                name={preset.name}
                description={preset.description}
                steps={preset.steps}
                durationTotal={preset.duration_total}
                isActive={isPresetActive(preset.steps)}
                isFavorite={favoritePresetId === preset.id}
                onSelect={() => onSelectPreset(preset.steps)}
                onToggleFavorite={(e) => onToggleFavorite(e, preset.id)}
                onDelete={(e) => onDeletePreset(e, preset.id)}
              />
            ))}
          </List>

          <DefaultPresetsList
            onSelectPreset={onSelectPreset}
            isPresetActive={isPresetActive}
          />
        </>
      )}
    </Box>
  );
}
