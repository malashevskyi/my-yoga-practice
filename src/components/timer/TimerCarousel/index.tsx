import { Box, Typography, ButtonBase } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTimerStore } from "../../../store/timerStore";
import { formatTime } from "../../../utils/formatTime";
import { VerticalScrollWrapper } from "../../shared/VerticalScrollWrapper";
import { getFontSize } from "./utils/getForntSize";

const ACTIVE_TIMER_HEIGHT_VH = 30;

export function TimerCarousel() {
  const queue = useTimerStore((state) => state.queue);
  const activeTimerIndex = useTimerStore((state) => state.activeTimerIndex);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const adjustTimerDuration = useTimerStore(
    (state) => state.adjustTimerDuration,
  );

  // Track flash animation state for each timer
  const [flashingTimer, setFlashingTimer] = useState<{
    index: number;
    color: "success" | "error";
  } | null>(null);

  const handleDecrease = (index: number) => {
    adjustTimerDuration(index, -1); // Subtract 1 minute

    // Trigger flash animation
    setFlashingTimer({ index, color: "error" });
    setTimeout(() => setFlashingTimer(null), 300); // Clear after 0.3s
  };

  const handleIncrease = (index: number) => {
    adjustTimerDuration(index, 1); // Add 1 minute

    // Trigger flash animation
    setFlashingTimer({ index, color: "success" });
    setTimeout(() => setFlashingTimer(null), 300); // Clear after 0.3s
  };

  if (queue.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          py: 4,
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No timers loaded. Load a preset to begin.
        </Typography>
      </Box>
    );
  }

  return (
    <VerticalScrollWrapper
      activeIndex={activeTimerIndex}
      totalItems={queue.length}
      itemSpacingVh={ACTIVE_TIMER_HEIGHT_VH}
    >
      <AnimatePresence mode="popLayout">
        {queue.map((step, index) => {
          const isActive = index === activeTimerIndex;
          const isPast = index < activeTimerIndex;

          // Don't render past timers - they're in history now
          if (isPast) return null;

          // Calculate vertical offset with tighter spacing (in vh units)
          const offset = (index - activeTimerIndex) * ACTIVE_TIMER_HEIGHT_VH;

          const timeString = isActive
            ? formatTime(timeLeft)
            : formatTime(step.duration);

          // Check if this timer is currently flashing
          const isFlashing = flashingTimer?.index === index;
          const flashColor = flashingTimer?.color;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                y: `${offset}vh`,
                scale: isActive ? 1 : 0.85,
              }}
              exit={{ opacity: 0, y: -50 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                opacity: { duration: 0.3 },
              }}
              style={{
                position: "absolute",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  userSelect: "none",
                  position: "relative",
                }}
              >
                {/* Timer Type Label */}
                <Typography
                  variant={isActive ? "h6" : "body2"}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: isActive ? "min(6vw, 4vh)" : "2vh",
                    transition: "all 0.3s ease, color 0.3s ease",
                    color: isFlashing
                      ? `${flashColor}.main`
                      : isActive
                      ? "text.primary"
                      : "text.disabled",
                    mb: {
                      xs: 0,
                      md: -3,
                    },
                  }}
                >
                  {step.label}
                </Typography>

                {/* Time Display */}
                <Box sx={{ position: "relative" }}>
                  <Typography
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: isActive ? "-0.02em" : "normal",
                      transition: "all 0.3s ease, color 0.3s ease",
                      fontSize: getFontSize(isActive, timeString.length),
                      lineHeight: 1,
                      maxWidth: "100vw",
                      color: isFlashing
                        ? `${flashColor}.main`
                        : isActive
                        ? "text.primary"
                        : "text.disabled",
                    }}
                  >
                    {isActive
                      ? formatTime(timeLeft)
                      : formatTime(step.duration)}
                  </Typography>

                  {/* Invisible buttons over the time display */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      zIndex: 1,
                    }}
                  >
                    {/* Left button - decrease time */}
                    <ButtonBase
                      onClick={() => handleDecrease(index)}
                      sx={{
                        flex: 1,
                      }}
                      disableRipple
                    />

                    {/* Right button - increase time */}
                    <ButtonBase
                      onClick={() => handleIncrease(index)}
                      sx={{
                        flex: 1,
                      }}
                      disableRipple
                    />
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </VerticalScrollWrapper>
  );
}
