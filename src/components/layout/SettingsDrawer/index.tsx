import {
  Drawer,
  IconButton,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Formik, Form, useField } from "formik";
import { useSettingsStore } from "../../../store/settingsStore";
import { useDrawerStore } from "../../../store/drawerStore";
import { useAuthStore } from "../../../store/authStore";
import { useUpdateUserSettings } from "../../../hooks/useUpdateUserSettings";
import { OfflineWrapper } from "../../shared/OfflineWrapper";
import {
  settingsValidationSchema,
  type SettingsFormValues,
} from "./settingsValidationSchema";

function ClockifyApiKeyField() {
  const { t } = useTranslation();
  const [field, meta] = useField("clockifyApiKey");
  const updateProjectMutation = useUpdateUserSettings();

  return (
    <TextField
      {...field}
      fullWidth
      label={t("settings.clockifyApiKey")}
      type="password"
      placeholder={t("settings.clockifyApiKeyPlaceholder")}
      helperText={
        meta.touched && meta.error
          ? meta.error
          : t("settings.clockifyApiKeyHelp")
      }
      error={meta.touched && Boolean(meta.error)}
      disabled={updateProjectMutation.isPending}
      autoComplete="off"
    />
  );
}

function ClockifyWorkspaceIdField() {
  const { t } = useTranslation();
  const [field, meta] = useField("clockifyWorkspaceId");
  const updateProjectMutation = useUpdateUserSettings();

  return (
    <TextField
      {...field}
      fullWidth
      label={t("settings.clockifyWorkspaceId")}
      placeholder={t("settings.clockifyWorkspaceIdPlaceholder")}
      helperText={
        meta.touched && meta.error
          ? meta.error
          : t("settings.clockifyWorkspaceIdHelp")
      }
      error={meta.touched && Boolean(meta.error)}
      disabled={updateProjectMutation.isPending}
    />
  );
}

function TrackingProjectNameField() {
  const { t } = useTranslation();
  const [field, meta] = useField("trackingProjectName");
  const updateProjectMutation = useUpdateUserSettings();

  return (
    <TextField
      {...field}
      fullWidth
      label={t("settings.clockifyProject")}
      placeholder={t("settings.clockifyProjectPlaceholder")}
      helperText={
        meta.touched && meta.error
          ? meta.error
          : t("settings.clockifyProjectHelp")
      }
      error={meta.touched && Boolean(meta.error)}
      disabled={updateProjectMutation.isPending}
    />
  );
}

export function SettingsDrawer() {
  const { t } = useTranslation();
  const isOpen = useDrawerStore((state) => state.isSettingsDrawerOpen);
  const setIsOpen = useDrawerStore((state) => state.setSettingsDrawerOpen);
  const autoDimEnabled = useSettingsStore((state) => state.autoDimEnabled);
  const setAutoDimEnabled = useSettingsStore(
    (state) => state.setAutoDimEnabled,
  );
  const userSettings = useAuthStore((state) => state.userSettings);
  const updateProjectMutation = useUpdateUserSettings();

  const initialValues: SettingsFormValues = {
    clockifyApiKey: userSettings?.clockifyApiKey || "",
    clockifyWorkspaceId: userSettings?.clockifyWorkspaceId || "",
    trackingProjectName: userSettings?.trackingProjectName || "",
  };

  const handleSubmit = (values: SettingsFormValues) => {
    updateProjectMutation.mutate({
      tracking_project_name: values.trackingProjectName.trim(),
      clockify_api_key: values.clockifyApiKey.trim(),
      clockify_workspace_id: values.clockifyWorkspaceId.trim(),
    });
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleAutoDimChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoDimEnabled(event.target.checked);
  };

  return (
    <>
      {/* Settings Button */}
      <IconButton onClick={toggleDrawer} size="large">
        <SettingsIcon />
      </IconButton>

      {/* Settings Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            maxWidth: 400,
            width: "100vw",
            height: "100vh",
            display: "grid",
            gridTemplateRows: "auto 1fr",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">{t("settings.title")}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Settings Content */}
          <Box sx={{ p: 3, overflowY: "auto" }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("settings.displaySettings")}
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={autoDimEnabled}
                  onChange={handleAutoDimChange}
                />
              }
              label={
                <Box pl={2}>
                  <Typography variant="body1">
                    {t("settings.autoDimTitle")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("settings.autoDimDescription")}
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary">
              {t("settings.brightnessNote")}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Clockify Integration with Formik */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("settings.trackingSettings")}
            </Typography>

            <OfflineWrapper fallbackMessage={t("offline.settings")}>
              <Formik
                initialValues={initialValues}
                validationSchema={settingsValidationSchema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <ClockifyApiKeyField />
                      <ClockifyWorkspaceIdField />

                      <TrackingProjectNameField />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !isValid || !dirty}
                        startIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                      >
                        {isSubmitting
                          ? t("settings.saving")
                          : t("settings.saveProject")}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </OfflineWrapper>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
