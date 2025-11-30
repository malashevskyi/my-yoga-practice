import { TextField } from "@mui/material";
import { useField } from "formik";

export function PresetBasicInfo() {
  const [nameField] = useField("name");
  const [descriptionField] = useField("description");

  return (
    <>
      <TextField
        label="Preset Name"
        fullWidth
        {...nameField}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        label="Description (optional)"
        fullWidth
        multiline
        rows={2}
        {...descriptionField}
        sx={{ mb: 3 }}
      />
    </>
  );
}
