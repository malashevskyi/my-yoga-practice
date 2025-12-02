import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { darkTheme } from "../../../theme/theme";
import { queryClient } from "../../../lib/queryClient";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
