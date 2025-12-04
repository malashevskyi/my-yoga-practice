import * as yup from "yup";
import i18n from "../../../i18n";

export interface SettingsFormValues {
  clockifyApiKey: string;
  clockifyWorkspaceId: string;
  trackingProjectName: string;
}

export const settingsValidationSchema = yup.object().shape({
  clockifyApiKey: yup
    .string()
    .trim()
    .required(() => i18n.t("settings.clockifyApiKeyRequired")),
  clockifyWorkspaceId: yup
    .string()
    .trim()
    .required(() => i18n.t("settings.clockifyWorkspaceIdRequired")),
  trackingProjectName: yup
    .string()
    .trim()
    .required(() => i18n.t("settings.clockifyProjectRequired")),
});
