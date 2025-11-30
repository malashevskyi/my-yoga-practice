import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTimerStore } from "../../../store/timerStore";
import { formatTime } from "../../../utils/time";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        overflow: "hidden",
        position: "relative",
        py: 4,
      }}
    >
      <AnimatePresence mode="popLayout">
        {queue.map((step, index) => {
          const isActive = index === activeTimerIndex;
          const isPast = index < activeTimerIndex;

          // Calculate vertical offset with tighter spacing (in vh units)
          const offset = (index - activeTimerIndex) * 30; // 30vh spacing (tighter)

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
                    // Active: 33vh, Inactive: 25vh (slightly smaller)
                    fontSize: isActive ? "33vh" : "25vh",
                    lineHeight: 1,
                    color: isActive ? "text.primary" : "text.disabled",
                  }}
                >
                  {isActive ? formatTime(timeLeft) : formatTime(step.duration)}
                </Typography>

                {/* Status indicator for past items */}
                {isPast && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{
                      mt: 0.5,
                      fontSize: "1.5vh",
                      transition: "all 0.3s ease",
                    }}
                  >
                    ✓ Complete
                  </Typography>
                )}
              </Box>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Box>
  );
}
