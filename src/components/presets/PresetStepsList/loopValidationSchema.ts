import * as yup from "yup";
import i18n from "../../../i18n";

export interface LoopFormValues {
  loopCount: number;
}

export const loopValidationSchema = yup.object().shape({
  loopCount: yup
    .number()
    .required(() => i18n.t("presetSteps.loopCountRequired"))
    .min(2, () => i18n.t("presetSteps.loopCountMin"))
    .max(10, () => i18n.t("presetSteps.loopCountMax"))
    .integer(() => i18n.t("presetSteps.loopCountInteger")),
});
