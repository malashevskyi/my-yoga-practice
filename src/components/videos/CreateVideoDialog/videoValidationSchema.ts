import * as yup from "yup";
import i18n from "../../../i18n";

export interface VideoFormValues {
  title: string;
  url: string;
}

export const videoValidationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required(() => i18n.t("createVideo.titleRequired")),
  url: yup
    .string()
    .trim()
    .required(() => i18n.t("createVideo.urlRequired"))
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      () => i18n.t("createVideo.urlInvalid")
    ),
});
