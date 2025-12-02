import { Box } from "@mui/material";
import { ThemeSwitcher } from "./components/core/ThemeSwitcher";
import { LanguageSwitcher } from "./components/core/LanguageSwitcher";
import { ErrorBoundary } from "./components/core/ErrorBoundary";
import { AppDrawer } from "./components/layout/AppDrawer";
import { GlobalProgress } from "./components/timer/GlobalProgress";
import { CurrentTime } from "./components/timer/CurrentTime";
import { TimerCarousel } from "./components/timer/TimerCarousel";
import { TimerControls } from "./components/timer/TimerControls";
import { GongPlayer } from "./components/audio/GongPlayer";
import { useTimerEngine } from "./hooks/useTimerEngine";
import { useFavoritePresetAutoload } from "./hooks/useFavoritePresetAutoload";
import { useTimerStore } from "./store/timerStore";

function App() {
  // Initialize timer engine
  useTimerEngine();

  // Auto-load favorite preset on startup
  useFavoritePresetAutoload();

  const gongToPlay = useTimerStore((state) => state.gongToPlay);

  return (
    <ErrorBoundary>
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
