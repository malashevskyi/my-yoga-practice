import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Loop as LoopIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Formik, Form } from "formik";
import { PresetStepItem } from "../PresetStepItem";
import type { TimerStep } from "../../../types/timer";
import {
  loopValidationSchema,
  type LoopFormValues,
} from "./loopValidationSchema";

interface PresetStepsListProps {
  steps: TimerStep[];
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
  onStepChange: (index: number, field: string, value: string | number) => void;
  onLoopSteps: (count: number) => void;
}

export function PresetStepsList({
  steps,
  onAddStep,
  onRemoveStep,
  onStepChange,
  onLoopSteps,
}: PresetStepsListProps) {
  const { t } = useTranslation();
  const [loopDialogOpen, setLoopDialogOpen] = useState(false);

  const initialValues: LoopFormValues = {
    loopCount: 2,
  };

  const handleLoopSubmit = (values: LoopFormValues) => {
    onLoopSteps(values.loopCount);
    setLoopDialogOpen(false);
  };

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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<LoopIcon />}
            onClick={() => setLoopDialogOpen(true)}
            disabled={steps.length === 0}
          >
            {t("presetSteps.loop")}
          </Button>
          <Button size="small" startIcon={<AddIcon />} onClick={onAddStep}>
            {t("presetSteps.addStep")}
          </Button>
        </Box>
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

      {/* Loop Dialog with Formik + Yup */}
      <Dialog open={loopDialogOpen} onClose={() => setLoopDialogOpen(false)}>
        <Formik
          initialValues={initialValues}
          validationSchema={loopValidationSchema}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={handleLoopSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
            <Form>
              <DialogTitle>{t("presetSteps.loopTitle")}</DialogTitle>
              <DialogContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("presetSteps.loopDescription", { count: steps.length })}
                </Typography>
                <TextField
                  autoFocus
                  name="loopCount"
                  label={t("presetSteps.loopCount")}
                  type="number"
                  fullWidth
                  value={values.loopCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loopCount && Boolean(errors.loopCount)}
                  helperText={
                    touched.loopCount && errors.loopCount
                      ? errors.loopCount
                      : t("presetSteps.loopHelp")
                  }
                  slotProps={{
                    htmlInput: {
                      min: 2,
                      max: 10,
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setLoopDialogOpen(false)}>
                  {t("createPreset.cancel")}
                </Button>
                <Button type="submit" variant="contained" disabled={!isValid}>
                  {t("presetSteps.loopConfirm")}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
