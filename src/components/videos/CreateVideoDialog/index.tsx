import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form, useField, type FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { useCreateVideo } from "../../../hooks/useCreateVideo";
import {
  videoValidationSchema,
  type VideoFormValues,
} from "./videoValidationSchema";

interface CreateVideoDialogProps {
  open: boolean;
  onClose: () => void;
}

function VideoTitleField() {
  const { t } = useTranslation();
  const [field, meta] = useField("title");

  return (
    <TextField
      {...field}
      label={t("createVideo.titleLabel")}
      fullWidth
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}

function VideoUrlField() {
  const { t } = useTranslation();
  const [field, meta] = useField("url");

  return (
    <TextField
      {...field}
      label={t("createVideo.urlLabel")}
      fullWidth
      placeholder={t("createVideo.urlPlaceholder")}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}

export function CreateVideoDialog({ open, onClose }: CreateVideoDialogProps) {
  const { t } = useTranslation();
  const mutation = useCreateVideo();

  const initialValues: VideoFormValues = {
    title: "",
    url: "",
  };

  const handleSubmit = (
    values: VideoFormValues,
    { setSubmitting, resetForm }: FormikHelpers<VideoFormValues>,
  ) => {
    mutation.mutate(
      {
        title: values.title.trim(),
        url: values.url.trim(),
      },
      {
        onSuccess: () => {
          resetForm();
          setSubmitting(false);
          onClose();
        },
        onError: () => {
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={videoValidationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, isValid }) => (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <Form>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{t("createVideo.title")}</Typography>
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

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <VideoTitleField />
                <VideoUrlField />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                {t("createVideo.cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !isValid}
                sx={{ textTransform: "none" }}
              >
                {isSubmitting
                  ? t("createVideo.creating")
                  : t("createVideo.create")}
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
