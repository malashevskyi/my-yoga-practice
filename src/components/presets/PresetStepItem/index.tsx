import { Box, TextField, IconButton, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useFormikContext } from "formik";
import type { TimerStep } from "../../../types/timer";
import type { PresetFormValues } from "../CreatePresetDialog/utils";

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
  const { errors, touched } = useFormikContext<PresetFormValues>();

  // Get errors for this specific step
  const stepErrors = errors.steps?.[index] as
    | { label?: string; duration?: string }
    | undefined;
  const stepTouched = touched.steps?.[index] as
    | { label?: boolean; duration?: boolean }
    | undefined;

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

      <TextField
        id={`step-${index}-label`}
        name={`steps[${index}].label`}
        label={t("presetSteps.label")}
        fullWidth
        value={step.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        error={stepTouched?.label && Boolean(stepErrors?.label)}
        helperText={stepTouched?.label && stepErrors?.label}
      />

      <TextField
        id={`step-${index}-duration`}
        name={`steps[${index}].duration`}
        label={t("presetSteps.duration")}
        type="number"
        sx={{ width: 200 }}
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
        error={stepTouched?.duration && Boolean(stepErrors?.duration)}
        helperText={stepTouched?.duration && stepErrors?.duration}
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
