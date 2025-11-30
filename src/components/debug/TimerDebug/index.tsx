import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { PlayArrow, Pause, Replay, SkipNext, Add } from "@mui/icons-material";
import { useTimerStore } from "../../../store/timerStore";
import { useTimerEngine } from "../../../hooks/useTimerEngine";
import type { TimerStep } from "../../../types/timer";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export function TimerDebug() {
  // Initialize the timer engine
  useTimerEngine();

  // Get store state
  const queue = useTimerStore((state) => state.queue);
  const activeTimerIndex = useTimerStore((state) => state.activeTimerIndex);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const status = useTimerStore((state) => state.status);
  const isLooping = useTimerStore((state) => state.isLooping);
  const totalProgress = useTimerStore((state) => state.totalProgress);

  // Get store actions
  const setQueue = useTimerStore((state) => state.setQueue);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const resetCurrent = useTimerStore((state) => state.resetCurrent);
  const skipNext = useTimerStore((state) => state.skipNext);
  const setIsLooping = useTimerStore((state) => state.setIsLooping);

  const currentStep = queue[activeTimerIndex];

  const handleLoadTestPreset = () => {
    const testSteps: TimerStep[] = [
      {
        id: crypto.randomUUID(),
        duration: 5,
        label: "Warm Up",
        type: "timer",
      },
      {
        id: crypto.randomUUID(),
        duration: 3,
        label: "Break",
        type: "break",
      },
      {
        id: crypto.randomUUID(),
        duration: 5,
        label: "Cool Down",
        type: "timer",
      },
    ];
    setQueue(testSteps);
  };

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          🧘 Timer Debug Dashboard
        </Typography>

        {/* Status & Controls */}
        <Stack spacing={3} sx={{ mt: 3 }}>
          {/* Status Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Status:</Typography>
            <Chip
              label={status.toUpperCase()}
              color={getStatusColor()}
              size="small"
            />
          </Box>

          {/* Current Timer Info */}
          {currentStep && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {currentStep.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {currentStep.type} | Step {activeTimerIndex + 1} of{" "}
                {queue.length}
              </Typography>
              <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                {formatTime(timeLeft)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={totalProgress}
                sx={{ height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Progress: {totalProgress.toFixed(1)}%
              </Typography>
            </Paper>
          )}

          {/* Queue Info */}
          {queue.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Queue: {queue.length} step(s) loaded
              </Typography>
            </Box>
          )}

          {/* Loop Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={isLooping}
                onChange={(e) => setIsLooping(e.target.checked)}
              />
            }
            label="Loop Queue"
          />

          {/* Control Buttons */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleLoadTestPreset}
              disabled={status === "running"}
            >
              Load Test Preset
            </Button>

            {status !== "running" ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrow />}
                onClick={start}
                disabled={queue.length === 0}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="contained"
                color="warning"
                startIcon={<Pause />}
                onClick={pause}
              >
                Pause
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={resetCurrent}
              disabled={!currentStep}
            >
              Reset Step
            </Button>

            <Button
              variant="outlined"
              startIcon={<SkipNext />}
              onClick={skipNext}
              disabled={!currentStep}
            >
              Skip
            </Button>
          </Stack>

          {/* Debug Info */}
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "background.default" }}
          >
            <Typography variant="caption" component="pre" sx={{ m: 0 }}>
              {JSON.stringify(
                {
                  activeTimerIndex,
                  timeLeft,
                  status,
                  isLooping,
                  totalProgress: totalProgress.toFixed(1),
                  queueLength: queue.length,
                },
                null,
                2,
              )}
            </Typography>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}
