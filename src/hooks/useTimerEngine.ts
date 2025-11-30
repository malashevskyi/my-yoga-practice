import { useEffect } from "react";
import { useTimerStore } from "../store/timerStore";

export function useTimerEngine() {
  const status = useTimerStore((state) => state.status);
  const updateTime = useTimerStore((state) => state.updateTime);

  useEffect(() => {
    if (status !== "running") return;

    // Update every 100ms for smooth UI, but calculations are based on real timestamps
    const intervalId = setInterval(() => {
      updateTime();
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, updateTime]);
}
