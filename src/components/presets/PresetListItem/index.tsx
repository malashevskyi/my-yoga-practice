import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../../utils/formatTime";
import type { TimerStep } from "../../../types/timer";

interface PresetListItemProps {
  id: string;
  name: string;
  description?: string | null;
  steps: TimerStep[];
  durationTotal: number;
  isActive: boolean;
  onSelect: () => void;
  isDefaultPreset?: boolean;
}

export function PresetListItem({
  name,
  description,
  steps,
  durationTotal,
  isActive,
  onSelect,
  isDefaultPreset = false,
}: PresetListItemProps) {
  const { t } = useTranslation();

  const displayName = isDefaultPreset ? t(`defaultPresets.${name}`) : name;

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onSelect}
        selected={isActive}
        sx={{
          borderRadius: 1,
          mb: 0.5,
        }}
      >
        <ListItemText
          primary={displayName}
          secondary={
            <>
              {description && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {description}
                  <br />
                </Typography>
              )}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                {steps.length} {t("presets.steps")} • {t("presets.total")}:{" "}
                {formatTime(durationTotal)}
              </Typography>
            </>
          }
          primaryTypographyProps={{
            fontWeight: 600,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
