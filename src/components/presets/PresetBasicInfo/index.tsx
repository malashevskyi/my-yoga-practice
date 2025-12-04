import { TextField } from "@mui/material";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

export function PresetBasicInfo() {
  const { t } = useTranslation();
  const [nameField, nameMeta] = useField("name");
  const [descriptionField, descriptionMeta] = useField("description");

  return (
    <>
      <TextField
        id="preset-name"
        label={t("createPreset.name")}
        fullWidth
        autoComplete="off"
        {...nameField}
        error={nameMeta.touched && Boolean(nameMeta.error)}
        helperText={nameMeta.touched && nameMeta.error}
        sx={{ mb: 2 }}
      />

      <TextField
        id={descriptionField.name}
        label={t("createPreset.description")}
        fullWidth
        multiline
        rows={2}
        {...descriptionField}
        error={descriptionMeta.touched && Boolean(descriptionMeta.error)}
        helperText={descriptionMeta.touched && descriptionMeta.error}
        sx={{ mb: 3 }}
      />
    </>
  );
}
