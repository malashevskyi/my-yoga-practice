import { Box, Typography, Stack, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";

export function ThemeDemo() {
  const { t } = useTranslation();

  return (
    <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <Stack direction="row" spacing={1}>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </Stack>
      </Box>

      <Typography variant="h3" component="h1" gutterBottom>
        {t("title")}
      </Typography>
    </Paper>
  );
}
