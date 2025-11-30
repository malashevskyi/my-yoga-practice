import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeStore } from "../../../store/themeStore";

export function ThemeSwitcher() {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      aria-label="toggle theme"
      size="large"
    >
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
