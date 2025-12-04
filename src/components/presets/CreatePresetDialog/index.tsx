import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import { PresetBasicInfo } from "../PresetBasicInfo";
import { PresetStepsList } from "../PresetStepsList";
import { createDefaultStep, type PresetFormValues } from "./utils";
import { useCreatePreset } from "../../../hooks/useCreatePreset";
import { presetValidationSchema } from "./presetValidationSchema";

interface CreatePresetDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePresetDialog({ open, onClose }: CreatePresetDialogProps) {
  const { t } = useTranslation();
  const mutation = useCreatePreset();

  const initialValues: PresetFormValues = {
    name: "",
    description: "",
    steps: [createDefaultStep()],
  };

  const handleSubmit = (values: PresetFormValues) => {
    mutation.mutate(
      {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        steps: values.steps,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={presetValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <Form>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{t("createPreset.title")}</Typography>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              {mutation.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {mutation.error.message}
                </Alert>
              )}

              <PresetBasicInfo />

              <PresetStepsList
                steps={values.steps}
                onAddStep={() =>
                  setFieldValue("steps", [...values.steps, createDefaultStep()])
                }
                onRemoveStep={(index) =>
                  setFieldValue(
                    "steps",
                    values.steps.filter((_, i) => i !== index),
                  )
                }
                onStepChange={(index, field, value) => {
                  const newSteps = [...values.steps];
                  if (field === "duration") {
                    newSteps[index] = {
                      ...newSteps[index],
                      [field]: typeof value === "number" ? value * 60 : 0,
                    };
                  } else {
                    newSteps[index] = {
                      ...newSteps[index],
                      [field]: value,
                    };
                  }
                  setFieldValue("steps", newSteps);
                }}
                onLoopSteps={(count) => {
                  // Duplicate all current steps 'count' times
                  const loopedSteps: typeof values.steps = [];
                  for (let i = 0; i < count; i++) {
                    values.steps.forEach((step) => {
                      loopedSteps.push({
                        ...step,
                        id: crypto.randomUUID(),
                      });
                    });
                  }
                  setFieldValue("steps", loopedSteps);
                }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                {t("createPreset.cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting
                  ? t("createPreset.creating")
                  : t("createPreset.create")}
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
