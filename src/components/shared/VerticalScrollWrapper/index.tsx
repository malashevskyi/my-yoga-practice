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
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
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
        {children}
      </motion.div>
    </Box>
  );
}
