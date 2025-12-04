import * as yup from "yup";
import i18n from "../../../i18n";

export const presetValidationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(() => i18n.t("createPreset.nameRequired")),
  description: yup.string(),
  steps: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        type: yup.string().required(),
        label: yup
          .string()
          .trim()
          .required(() => i18n.t("createPreset.stepLabelRequired")),
        duration: yup
          .number()
          .min(1, () => i18n.t("createPreset.stepDurationMin")),
      }),
    )
    .min(1, () => i18n.t("createPreset.stepsRequired")),
});
