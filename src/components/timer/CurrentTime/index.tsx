import { Box, LinearProgress, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getFitTextSize } from "../../../utils/getFitTextSize";
import { getYogaPeriod } from "../../../utils/getYogaPeriod";
import { getYogaPeriodProgress } from "../../../utils/getYogaPeriodProgress";

const YOGA_PERIOD_NAMES = ["purple", "green", "lightBlue", "royalBlue"];

const PERIOD_COLORS: Record<(typeof YOGA_PERIOD_NAMES)[number], string> = {
  purple: "#9370DB", // Purple
  green: "#90EE90", // Green
  lightBlue: "#87CEEB", // Light Blue
  royalBlue: "#4169E1", // Royal Blue
};

export function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = format(time, "HH:mm");
  const currentPeriod = getYogaPeriod(time);
  const periodProgress = getYogaPeriodProgress(time);
  const periodName = YOGA_PERIOD_NAMES[currentPeriod];
  const periodColor = PERIOD_COLORS[periodName];

  const fontSize = getFitTextSize(timeString.length, 16, 30);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 2,
        zIndex: 0,
      }}
    >
      {/* Current Time Display */}
      <Typography
        sx={{
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          fontSize: fontSize,
          lineHeight: 1,
          color: periodColor,
          opacity: 0.7,
          mb: 1,
        }}
      >
        {timeString}
      </Typography>

      {/* Yoga Period Indicator */}
      <Box
        sx={{
          width: "100%",
          px: 2,
        }}
      >
        {/* Progress Bar with 4 Segments */}
        <Box sx={{ position: "relative", height: 8 }}>
          {/* Background segments */}
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              width: "100%",
              height: "100%",
              gap: "2px",
            }}
          >
            {[0, 1, 2, 3].map((period) => (
              <Box
                key={period}
                sx={{
                  flex: 1,
                  bgcolor:
                    period === currentPeriod
                      ? `${PERIOD_COLORS[YOGA_PERIOD_NAMES[period]]}40`
                      : (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.15)",
                  borderRadius: 0.5,
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Box>

          {/* Active progress indicator */}
          <Box
            sx={{
              position: "absolute",
              left: `${currentPeriod * 25 + 0.25}%`, // Offset by segment gaps
              width: `${24.5}%`, // Slightly less to account for gaps
              height: "100%",
            }}
          >
            <LinearProgress
              variant="determinate"
              value={periodProgress * 100}
              sx={{
                height: "100%",
                borderRadius: 0.5,
                bgcolor: "transparent",
                "& .MuiLinearProgress-bar": {
                  bgcolor: periodColor,
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
