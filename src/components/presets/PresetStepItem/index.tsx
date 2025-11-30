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
        <InputLabel>Type</InputLabel>
        <Select
          value={step.type}
          label="Type"
          onChange={(e) => onChange(index, "type", e.target.value as TimerType)}
        >
          <MenuItem value="timer">Timer</MenuItem>
          <MenuItem value="break">Break</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Label"
        fullWidth
        value={step.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        required
      />

      <TextField
        label="Duration (min)"
        type="number"
        sx={{ width: 140 }}
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
        inputProps={{ min: 1 }}
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
