import { LinearProgress, Box } from "@mui/material";
import { useTimerStore } from "../../../store/timerStore";

export function GlobalProgress() {
  const totalProgress = useTimerStore((state) => state.totalProgress);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "8px",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={totalProgress}
        sx={{
          height: "100%",
          "& .MuiLinearProgress-bar": {
            transition: "transform 0.1s linear",
          },
        }}
      />
    </Box>
  );
}
