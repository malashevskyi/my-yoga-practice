import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../store/themeStore";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function ThemeDemo() {
  const { mode, toggleTheme } = useThemeStore();
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
          <LanguageSwitcher />
        </Stack>
      </Box>

      <Typography variant="h3" component="h1" gutterBottom>
        {t("title")}
      </Typography>
      <Button variant="contained" onClick={toggleTheme} size="large">
        {t("toggleTheme")} ({t("currentTheme")}: {mode})
      </Button>
    </Paper>
  );
}
