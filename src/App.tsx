import { Box, GlobalStyles, useMediaQuery, useTheme } from "@mui/material";
import { LanguageSwitcher } from "./components/core/LanguageSwitcher";
import { LoginButton } from "./components/core/LoginButton";
import { LogoutButton } from "./components/core/LogoutButton";
import { ErrorBoundary } from "./components/core/ErrorBoundary";
import { AppDrawerWrapper } from "./components/layout/AppDrawerWrapper";
import { SettingsDrawer } from "./components/layout/SettingsDrawer";
import { GlobalProgress } from "./components/timer/GlobalProgress";
import { CurrentTime } from "./components/timer/CurrentTime";
import { TimerCarousel } from "./components/timer/TimerCarousel";
import { TimerControls } from "./components/timer/TimerControls";
import { GongPlayer } from "./components/audio/GongPlayer";
import { OfflineStatusIndicator } from "./components/shared/OfflineStatusIndicator";
import { useTimerEngine } from "./hooks/useTimerEngine";
import { useFavoritePresetAutoload } from "./hooks/useFavoritePresetAutoload";
import { useUserActivity } from "./hooks/useUserActivity";
import { useAuthInit } from "./hooks/useAuthInit";
import { usePendingTrackingSync } from "./hooks/usePendingTrackingSync";
import { useTimerStore } from "./store/timerStore";
import { useBrightnessStore } from "./store/brightnessStore";
import { useAuthStore } from "./store/authStore";
import { useMuiGhostFix } from "./hooks/useMuiGhostFix";
import { Toaster } from "sonner";
import { BackgroundParticles } from "./components/layout/BackgroundParticles";

function App() {
  // Initialize authentication state
  useAuthInit();

  // Initialize timer engine
  useTimerEngine();

  // Auto-load favorite preset on startup
  useFavoritePresetAutoload();

  // Track user activity to restore brightness
  useUserActivity();

  // Sync pending tracking entries on load and when coming back online
  usePendingTrackingSync();

  useMuiGhostFix('textarea[aria-hidden="true"].MuiInputBase-inputMultiline');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const gongToPlay = useTimerStore((state) => state.gongToPlay);
  const brightness = useBrightnessStore((state) => state.brightness);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const gongKey = useTimerStore((state) => state.gongKey);

  // Calculate opacity for dark theme (brightness affects text visibility)
  // brightness: 20 -> opacity: 0.5, brightness: 100 -> opacity: 1
  const textOpacity = 0.5 + (brightness / 100) * 0.5;

  return (
    <ErrorBoundary>
      <GlobalStyles
        styles={{
          body: {
            // Dark theme: reduce opacity of all text and elements
            // BUT keep brightness slider fully visible
            "& *:not(img):not(svg):not(path):not(.MuiSlider-root):not(.MuiSlider-root *)":
              {
                opacity: textOpacity,
                transition: "opacity 0.4s ease-in-out",
              },
          },
        }}
      />
      <Toaster />
      <OfflineStatusIndicator />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Global Progress Bar */}
        <GlobalProgress />

        {!isMobile && <BackgroundParticles variant="snow" />}

        {/* Language & Auth Controls (Top Right) */}
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            flexDirection: {
              xs: "column-reverse",
              md: "row",
            },
            gap: 1,
          }}
        >
          <AppDrawerWrapper />
          {isAuthenticated && <SettingsDrawer />}
          <LanguageSwitcher />
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Box>

        {/* Current Time with Yoga Period Indicator */}
        <CurrentTime />

        {/* Main Timer Carousel */}
        <TimerCarousel />

        {/* Timer Controls */}
        <TimerControls />

        {/* Gong Player (Hidden) */}
        {gongToPlay && <GongPlayer key={gongKey} src={gongToPlay} autoPlay />}
      </Box>
    </ErrorBoundary>
  );
}

export default App;
