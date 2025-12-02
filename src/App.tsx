import { Box, GlobalStyles } from "@mui/material";
import { ThemeSwitcher } from "./components/core/ThemeSwitcher";
import { LanguageSwitcher } from "./components/core/LanguageSwitcher";
import { AuthButton } from "./components/core/AuthButton";
import { ErrorBoundary } from "./components/core/ErrorBoundary";
import { AppDrawer } from "./components/layout/AppDrawer";
import { GlobalProgress } from "./components/timer/GlobalProgress";
import { CurrentTime } from "./components/timer/CurrentTime";
import { TimerCarousel } from "./components/timer/TimerCarousel";
import { TimerControls } from "./components/timer/TimerControls";
import { GongPlayer } from "./components/audio/GongPlayer";
import { useTimerEngine } from "./hooks/useTimerEngine";
import { useFavoritePresetAutoload } from "./hooks/useFavoritePresetAutoload";
import { useUserActivity } from "./hooks/useUserActivity";
import { useAuthInit } from "./hooks/useAuthInit";
import { useTimerStore } from "./store/timerStore";
import { useBrightnessStore } from "./store/brightnessStore";
import { useThemeStore } from "./store/themeStore";
import { useMuiGhostFix } from "./hooks/useMuiGhostFix";

function App() {
  // Initialize authentication state
  useAuthInit();

  // Initialize timer engine
  useTimerEngine();

  // Auto-load favorite preset on startup
  useFavoritePresetAutoload();

  // Track user activity to restore brightness
  useUserActivity();

  useMuiGhostFix('textarea[aria-hidden="true"].MuiInputBase-inputMultiline');

  const gongToPlay = useTimerStore((state) => state.gongToPlay);
  const brightness = useBrightnessStore((state) => state.brightness);
  const themeMode = useThemeStore((state) => state.mode);

  // Calculate opacity for both themes (brightness affects text visibility)
  // brightness: 20 -> opacity: 0.5, brightness: 100 -> opacity: 1
  const textOpacity = 0.5 + (brightness / 100) * 0.5;

  return (
    <ErrorBoundary>
      <GlobalStyles
        styles={{
          body:
            themeMode === "dark"
              ? {
                  // Dark theme: reduce opacity of all text and elements
                  // BUT keep brightness slider fully visible
                  "& *:not(img):not(svg):not(path):not(.MuiSlider-root):not(.MuiSlider-root *)":
                    {
                      opacity: textOpacity,
                      transition: "opacity 0.4s ease-in-out",
                    },
                }
              : {
                  // Light theme: reduce opacity of all text and elements (makes them grayer)
                  // BUT keep brightness slider fully visible
                  "& *:not(img):not(svg):not(path):not(.MuiSlider-root):not(.MuiSlider-root *)":
                    {
                      opacity: textOpacity,
                      transition: "opacity 0.4s ease-in-out",
                    },
                },
        }}
      />
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

        {/* Theme & Language Controls (Top Right) */}
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            display: "flex",
            gap: 1,
          }}
        >
          <AppDrawer />
          <ThemeSwitcher />
          <LanguageSwitcher />
          <AuthButton />
        </Box>

        {/* Current Time with Yoga Period Indicator */}
        <CurrentTime />

        {/* Main Timer Carousel */}
        <TimerCarousel />

        {/* Timer Controls */}
        <TimerControls />

        {/* Gong Player (Hidden) */}
        {gongToPlay && <GongPlayer src={gongToPlay} autoPlay />}
      </Box>
    </ErrorBoundary>
  );
}

export default App;
