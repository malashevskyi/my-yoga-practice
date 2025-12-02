import { TextField } from "@mui/material";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

export function PresetBasicInfo() {
  const { t } = useTranslation();
  const [nameField] = useField("name");
  const [descriptionField] = useField("description");

  return (
    <>
      <TextField
        id="preset-name"
        label={t("createPreset.name")}
        fullWidth
        autoComplete="false"
        {...nameField}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        id={descriptionField.name}
        label={t("createPreset.description")}
        fullWidth
        multiline
        rows={2}
        {...descriptionField}
        sx={{ mb: 3 }}
      />
    </>
  );
}
