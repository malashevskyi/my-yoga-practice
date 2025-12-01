import { useMotionValue, animate, MotionValue } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";

interface UseVerticalScrollProps {
  activeIndex: number;
  totalItems: number;
  itemSpacingVh: number;
}

interface UseVerticalScrollReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
  dragConstraints: { top: number; bottom: number };
}

export function useVerticalScroll({
  activeIndex,
  totalItems,
  itemSpacingVh,
}: UseVerticalScrollProps): UseVerticalScrollReturn {
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate constraints ONCE to avoid duplication
  const vh = window.innerHeight / 100;
  const itemSpacingPx = itemSpacingVh * vh;

  // Calculate how many items are AFTER the current one
  const futureItemsCount = Math.max(0, totalItems - 1 - activeIndex);

  // minY: How far we can scroll UP (negative value).
  // Example: If 2 items ahead, we can scroll -60vh.
  const minY = -(futureItemsCount * itemSpacingPx);

  // maxY: How far we can scroll DOWN (positive value).
  // Fixed at 0 because we don't want to pull the active timer down.
  const maxY = 0;

  // Handle mouse wheel using the pre-calculated constraints
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const currentY = y.get();
      let newY = currentY - e.deltaY;

      if (newY > maxY) newY = maxY;
      if (newY < minY) newY = minY;

      animate(y, newY, {
        type: "tween",
        ease: "easeOut",
        duration: 0.2,
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [minY, maxY, y]);

  return {
    containerRef,
    y,
    dragConstraints: {
      top: minY, // Minimum Y value (scrolled all the way up)
      bottom: maxY, // Maximum Y value (start position, 0)
    },
  };
}
