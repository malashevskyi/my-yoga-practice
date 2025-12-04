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
import { Formik, Form, Field, type FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { useCreateVideo } from "../../../hooks/useCreateVideo";

interface CreateVideoDialogProps {
  open: boolean;
  onClose: () => void;
}

interface VideoFormValues {
  title: string;
  url: string;
}

const validateVideoForm = (values: VideoFormValues) => {
  const errors: Partial<VideoFormValues> = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.url.trim()) {
    errors.url = "YouTube URL is required";
  } else {
    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(values.url)) {
      errors.url = "Please enter a valid YouTube URL";
    }
  }

  return errors;
};

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
      validate={validateVideoForm}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
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
                <Field
                  as={TextField}
                  name="title"
                  label={t("createVideo.titleLabel")}
                  fullWidth
                  required
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />

                <Field
                  as={TextField}
                  name="url"
                  label={t("createVideo.urlLabel")}
                  fullWidth
                  required
                  placeholder={t("createVideo.urlPlaceholder")}
                  error={touched.url && Boolean(errors.url)}
                  helperText={touched.url && errors.url}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                {t("createVideo.cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
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
