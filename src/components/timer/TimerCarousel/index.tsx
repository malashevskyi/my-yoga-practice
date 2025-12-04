import { useWindowSize } from "react-use";
import { Box, Typography, ButtonBase } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useTimerStore } from "../../../store/timerStore";
import { formatTime } from "../../../utils/formatTime";
import { VerticalScrollWrapper } from "../../shared/VerticalScrollWrapper";
import { getFontSize, getTimerSpacing } from "./utils/getForntSize";
import { EmptyTimerState } from "../EmptyTimerState";

export function TimerCarousel() {
  const queue = useTimerStore((state) => state.queue);
  const activeTimerIndex = useTimerStore((state) => state.activeTimerIndex);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const adjustTimerDuration = useTimerStore(
    (state) => state.adjustTimerDuration,
  );
  const { height, width } = useWindowSize();

  // Calculate adaptive spacing based on font size
  const itemSpacingVh = getTimerSpacing(width, height);

  // Track flash animation state for each timer
  const [flashingTimer, setFlashingTimer] = useState<{
    index: number;
    color: "success" | "error";
  } | null>(null);

  // Track pointer position to distinguish click from drag
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const DRAG_THRESHOLD = 10; // pixels - if moved more than this, it's a drag

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (
    e: React.PointerEvent,
    index: number,
    isLeftHalf: boolean,
  ) => {
    if (!pointerStart.current) return;

    // Calculate distance moved
    const deltaX = Math.abs(e.clientX - pointerStart.current.x);
    const deltaY = Math.abs(e.clientY - pointerStart.current.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Reset pointer start
    pointerStart.current = null;

    // If moved more than threshold, it was a drag - don't adjust timer
    if (distance > DRAG_THRESHOLD) {
      return;
    }

    // It was a click - adjust timer
    if (isLeftHalf) {
      handleDecrease(index);
    } else {
      handleIncrease(index);
    }
  };

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
    return <EmptyTimerState />;
  }

  return (
    <VerticalScrollWrapper
      activeIndex={activeTimerIndex}
      totalItems={queue.length}
      itemSpacingVh={itemSpacingVh}
    >
      <AnimatePresence mode="popLayout">
        {queue.map((step, index) => {
          const isActive = index === activeTimerIndex;
          const isPast = index < activeTimerIndex;

          // Don't render past timers - they're in history now
          if (isPast) return null;

          // Calculate vertical offset with adaptive spacing (in vh units)
          const offset = (index - activeTimerIndex) * itemSpacingVh;

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
                pt={height > 400 ? 10 : 15}
                sx={{
                  textAlign: "center",
                  userSelect: "none",
                  position: "relative",
                }}
              >
                {/* Timer Type Label */}
                {height > 550 && (
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
                )}

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
                      onPointerDown={handlePointerDown}
                      onPointerUp={(e) => handlePointerUp(e, index, true)}
                      sx={{
                        flex: 1,
                      }}
                      disableRipple
                    />

                    {/* Right button - increase time */}
                    <ButtonBase
                      onPointerDown={handlePointerDown}
                      onPointerUp={(e) => handlePointerUp(e, index, false)}
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
