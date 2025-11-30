import { Box, Button } from "@mui/material";
import { ThemeSwitcher } from "./components/core/ThemeSwitcher";
import { LanguageSwitcher } from "./components/core/LanguageSwitcher";
import { AppDrawer } from "./components/layout/AppDrawer";
import { GlobalProgress } from "./components/timer/GlobalProgress";
import { TimerCarousel } from "./components/timer/TimerCarousel";
import { TimerControls } from "./components/timer/TimerControls";
import { GongPlayer } from "./components/audio/GongPlayer";
import { useTimerEngine } from "./hooks/useTimerEngine";
import { useTimerStore } from "./store/timerStore";
import type { TimerStep } from "./types/timer";

function App() {
  // Initialize timer engine
  useTimerEngine();

  // Get store state and actions for test preset
  const setQueue = useTimerStore((state) => state.setQueue);
  const gongToPlay = useTimerStore((state) => state.gongToPlay);

  const handleLoadTestPreset = () => {
    const testSteps: TimerStep[] = [
      { id: "1", type: "timer", duration: 10, label: "Warmup" },
      { id: "2", type: "timer", duration: 15, label: "Work" },
      { id: "3", type: "break", duration: 20, label: "Rest" },
    ];
    setQueue(testSteps);
  };

  return (
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

      {/* Test Preset Button (Top Left) */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleLoadTestPreset}
          sx={{ textTransform: "none" }}
        >
          Load Test Preset
        </Button>
      </Box>

      {/* Main Timer Carousel */}
      <TimerCarousel />

      {/* Timer Controls */}
      <TimerControls />

      {/* Gong Player (Hidden) */}
      {gongToPlay && <GongPlayer src={gongToPlay} autoPlay />}
    </Box>
  );
}

export default App;
