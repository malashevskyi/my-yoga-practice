import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useVerticalScroll } from "../../../hooks/useVerticalScroll";

interface VerticalScrollWrapperProps {
  children: ReactNode;
  activeIndex: number;
  totalItems: number;
  itemSpacingVh: number;
}

export function VerticalScrollWrapper({
  children,
  activeIndex,
  totalItems,
  itemSpacingVh,
}: VerticalScrollWrapperProps) {
  const { containerRef, y, dragConstraints } = useVerticalScroll({
    activeIndex,
    totalItems,
    itemSpacingVh,
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        overflow: "hidden",
        position: "relative",
        // Fade mask for top/bottom edges
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 1%, black 75%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 1%, black 75%, transparent 100%)",
      }}
    >
      <motion.div
        drag="y"
        dragConstraints={dragConstraints}
        dragElastic={0.2}
        dragTransition={{
          power: 0.4,
          timeConstant: 200,
          bounceStiffness: 400,
          bounceDamping: 40,
        }}
        style={{
          y,
          cursor: "grab",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Background that moves with timers
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-20vh",
              left: 0,
              right: 0,
              height: "400vh",
              width: "100vw",
              background: (theme) => `linear-gradient(
                to bottom,
                transparent 0%,
                ${theme.palette.background.default} 5%,
                ${theme.palette.background.default} 10%,
                ${theme.palette.background.default} 100%
              )`,
              pointerEvents: "none",
            },
          }}
        >
          {children}
        </Box>
      </motion.div>
    </Box>
  );
}
