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
        label={t("createPreset.name")}
        fullWidth
        {...nameField}
        sx={{ mb: 2 }}
        required
      />

      <TextField
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
