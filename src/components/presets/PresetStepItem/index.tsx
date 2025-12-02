import {
  Box,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { TimerStep, TimerType } from "../../../types/timer";

interface PresetStepItemProps {
  step: TimerStep;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: string | number) => void;
}

export function PresetStepItem({
  step,
  index,
  canRemove,
  onRemove,
  onChange,
}: PresetStepItemProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-start",
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, minWidth: 24 }}
      >
        {index + 1}.
      </Typography>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel htmlFor={`step-${index}-type`}>
          {t("presetSteps.type")}
        </InputLabel>
        <Select
          id={`step-${index}-type`}
          name={`step-${index}-type`}
          value={step.type}
          label={t("presetSteps.type")}
          onChange={(e) => onChange(index, "type", e.target.value as TimerType)}
          sx={{
            "& .MuiSelect-nativeInput": {
              display: "none !important",
            },
          }}
          inputProps={{
            id: `step-${index}-type`,
            name: `step-${index}-type`,
          }}
        >
          <MenuItem value="timer">{t("timerTypes.timer")}</MenuItem>
          <MenuItem value="break">{t("timerTypes.break")}</MenuItem>
          <MenuItem value="video">{t("timerTypes.video")}</MenuItem>
        </Select>
      </FormControl>

      <TextField
        id={`step-${index}-label`}
        name={`step-${index}-label`}
        label={t("presetSteps.label")}
        fullWidth
        value={step.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        required
      />

      <TextField
        id={`step-${index}-duration`}
        name={`step-${index}-duration`}
        label={t("presetSteps.duration")}
        type="number"
        sx={{
          width: 140,

          "& .MuiOutlinedInput-notchedOutline legend span": {
            visibility: "hidden",
            maxWidth: 0,
          },
        }}
        defaultValue={Math.round(step.duration / 60)}
        onBlur={(e) => {
          const value = e.target.value;
          if (value === "" || parseInt(value) <= 0) {
            e.target.value = "1";
            onChange(index, "duration", 1);
          } else {
            onChange(index, "duration", parseInt(value));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        required
      />

      <IconButton
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
