import { ThemeProvider, CssBaseline } from "@mui/material";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { darkTheme } from "../../../theme/theme";
import { persister, queryClient } from "../../../lib/queryClient";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
