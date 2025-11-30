import { ThemeProvider, CssBaseline } from "@mui/material";
import { useThemeStore } from "../store/themeStore";
import { lightTheme, darkTheme } from "../theme/theme";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const { mode } = useThemeStore();
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
