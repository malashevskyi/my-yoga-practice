import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PresetStepItem } from "../PresetStepItem";
import type { TimerStep } from "../../../types/timer";

interface PresetStepsListProps {
  steps: TimerStep[];
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
  onStepChange: (index: number, field: string, value: string | number) => void;
}

export function PresetStepsList({
  steps,
  onAddStep,
  onRemoveStep,
  onStepChange,
}: PresetStepsListProps) {
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {t("presetSteps.title")}
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddStep}
          sx={{ textTransform: "none" }}
        >
          {t("presetSteps.addStep")}
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {steps.map((step, index) => (
          <PresetStepItem
            key={step.id}
            step={step}
            index={index}
            canRemove={steps.length > 1}
            onRemove={onRemoveStep}
            onChange={onStepChange}
          />
        ))}
      </Box>
    </>
  );
}
