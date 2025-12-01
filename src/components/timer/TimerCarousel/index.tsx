import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTimerStore } from "../../../store/timerStore";
import { formatTime } from "../../../utils/formatTime";
import { VerticalScrollWrapper } from "../../shared/VerticalScrollWrapper";
import { getFontSize } from "./utils/getForntSize";

const ACTIVE_TIMER_HEIGHT_VH = 30;

export function TimerCarousel() {
  const queue = useTimerStore((state) => state.queue);
  const activeTimerIndex = useTimerStore((state) => state.activeTimerIndex);
  const timeLeft = useTimerStore((state) => state.timeLeft);

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
                }}
              >
                {/* Timer Type Label */}
                <Typography
                  variant={isActive ? "h6" : "body2"}
                  sx={{
                    mb: 1,
                    textTransform: "capitalize",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: isActive ? "2vh" : "1.5vh",
                    transition: "all 0.3s ease",
                    color: isActive ? "text.primary" : "text.disabled",
                  }}
                >
                  {step.label}
                </Typography>

                {/* Time Display */}
                <Typography
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: isActive ? "-0.02em" : "normal",
                    transition: "all 0.3s ease",
                    fontSize: getFontSize(isActive, timeString.length),
                    lineHeight: 1,
                    maxWidth: "100vw",
                    color: isActive ? "text.primary" : "text.disabled",
                  }}
                >
                  {isActive ? formatTime(timeLeft) : formatTime(step.duration)}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </VerticalScrollWrapper>
  );
}
