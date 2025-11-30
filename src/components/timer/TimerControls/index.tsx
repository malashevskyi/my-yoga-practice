import { Box, IconButton } from "@mui/material";
import { PlayArrow, Pause, Refresh, SkipNext } from "@mui/icons-material";
import { useTimerStore } from "../../../store/timerStore";

export function TimerControls() {
  const status = useTimerStore((state) => state.status);
  const queue = useTimerStore((state) => state.queue);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const resetCurrent = useTimerStore((state) => state.resetCurrent);
  const skipNext = useTimerStore((state) => state.skipNext);

  const hasTimers = queue.length > 0;
  const isRunning = status === "running";
  const isCompleted = status === "completed";

  // Disable play/pause when no timers or completed
  const canPlayPause = hasTimers && !isCompleted;
  // Reset and skip available when has timers
  const canResetSkip = hasTimers;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        pb: 4,
      }}
    >
      {/* Play/Pause */}
      <IconButton
        onClick={isRunning ? pause : start}
        disabled={!canPlayPause}
        size="large"
        sx={{
          width: 72,
          height: 72,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          "&:disabled": {
            bgcolor: "action.disabledBackground",
          },
        }}
      >
        {isRunning ? (
          <Pause sx={{ fontSize: 40 }} />
        ) : (
          <PlayArrow sx={{ fontSize: 40 }} />
        )}
      </IconButton>

      {/* Reset */}
      <IconButton
        onClick={resetCurrent}
        disabled={!canResetSkip}
        size="large"
        sx={{
          width: 56,
          height: 56,
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected",
          },
          "&:disabled": {
            bgcolor: "action.disabledBackground",
          },
        }}
      >
        <Refresh sx={{ fontSize: 32 }} />
      </IconButton>

      {/* Skip */}
      <IconButton
        onClick={skipNext}
        disabled={!canResetSkip}
        size="large"
        sx={{
          width: 56,
          height: 56,
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected",
          },
          "&:disabled": {
            bgcolor: "action.disabledBackground",
          },
        }}
      >
        <SkipNext sx={{ fontSize: 32 }} />
      </IconButton>
    </Box>
  );
}
