import { Box, IconButton, Slider, Typography } from "@mui/material";
import useWindowSize from "react-use/lib/useWindowSize";
import {
  PlayArrow,
  Pause,
  Refresh,
  SkipNext,
  SkipPrevious,
  Clear,
  Brightness6,
} from "@mui/icons-material";
import { useTimerStore } from "../../../store/timerStore";
import { useBrightnessStore } from "../../../store/brightnessStore";
import { MAX_BRIGHTNESS, MIN_BRIGHTNESS } from "../../../common/constants";

export function TimerControls() {
  const status = useTimerStore((state) => state.status);
  const queue = useTimerStore((state) => state.queue);
  const activeTimerIndex = useTimerStore((state) => state.activeTimerIndex);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const resetCurrent = useTimerStore((state) => state.resetCurrent);
  const clearAll = useTimerStore((state) => state.clearAll);
  const skipNext = useTimerStore((state) => state.skipNext);
  const skipPrevious = useTimerStore((state) => state.skipPrevious);
  const { height } = useWindowSize();

  const brightness = useBrightnessStore((state) => state.brightness);
  const setBrightness = useBrightnessStore((state) => state.setBrightness);

  const hasTimers = queue.length > 0;
  const isRunning = status === "running";
  const isCompleted = status === "completed";

  // Disable play/pause when no timers or completed
  const canPlayPause = hasTimers && !isCompleted;
  // Reset and skip available when has timers
  const canResetSkip = hasTimers;
  // Previous button available when not at first timer (or when looping and has timers)
  const canSkipPrevious = hasTimers && activeTimerIndex > 0;

  const handleBrightnessChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    setBrightness(newValue as number);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        pb: 4,
      }}
    >
      {/* Control Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Previous */}
        <IconButton
          onClick={skipPrevious}
          disabled={!canSkipPrevious}
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
          <SkipPrevious sx={{ fontSize: 32 }} />
        </IconButton>

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

        {/* Skip Next */}
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

        {/* Clear All */}
        <IconButton
          onClick={clearAll}
          disabled={!hasTimers}
          size="large"
          sx={{
            width: 56,
            height: 56,
            bgcolor: "action.hover",
            color: "error.main",
            "&:hover": {
              bgcolor: "error.light",
              color: "error.contrastText",
            },
            "&:disabled": {
              bgcolor: "action.disabledBackground",
            },
          }}
        >
          <Clear sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      {/* Brightness Slider */}
      {height > 550 && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Brightness6 sx={{ fontSize: 24, opacity: 1 }} />
          <Slider
            value={brightness}
            onChange={handleBrightnessChange}
            min={MIN_BRIGHTNESS}
            max={MAX_BRIGHTNESS}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            sx={{
              flex: 1,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
              },
            }}
          />
          <Typography sx={{ minWidth: 45, textAlign: "right", opacity: 1 }}>
            {brightness}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}
