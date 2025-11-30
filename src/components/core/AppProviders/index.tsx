import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "../../../store/themeStore";
import { lightTheme, darkTheme } from "../../../theme/theme";
import { queryClient } from "../../../lib/queryClient";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const { mode } = useThemeStore();
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
