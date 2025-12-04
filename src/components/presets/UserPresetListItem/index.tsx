import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../../utils/formatTime";
import type { TimerStep } from "../../../types/timer";

interface UserPresetListItemProps {
  id: string;
  name: string;
  description?: string | null;
  steps: TimerStep[];
  durationTotal: number;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function UserPresetListItem({
  name,
  description,
  steps,
  durationTotal,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onDelete,
}: UserPresetListItemProps) {
  const { t } = useTranslation();

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            edge="end"
            aria-label="favorite"
            onClick={onToggleFavorite}
            color={isFavorite ? "primary" : "default"}
          >
            {isFavorite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton
        onClick={onSelect}
        selected={isActive}
        sx={{
          borderRadius: 1,
          mb: 0.5,
        }}
      >
        <ListItemText
          primary={name}
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
