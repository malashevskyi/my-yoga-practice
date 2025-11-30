import { Box, Button, Typography } from "@mui/material";
import { useThemeStore } from "../store/themeStore";

export function ThemeDemo() {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h1" component="h1">
        Yoga Timer
      </Typography>
      <Button variant="contained" onClick={toggleTheme} size="large">
        Toggle Theme (Current: {mode})
      </Button>
    </Box>
  );
}
