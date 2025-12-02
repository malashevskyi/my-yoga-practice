/**
 * Get the font size for the timer display based on its active state and text length
 * @param isActive - Whether the timer is currently active (first visible timer)
 * @param textLength - The length of the timer text (e.g., "00:00:00" vs "00:00")
 * @returns The calculated font size
 */
export function getFontSize(isActive: boolean, textLength: number) {
  const hasHours = textLength > 5; // "00:00:00" vs "00:00"

  if (isActive) {
    return hasHours ? "min(33vh, 16vw)" : "min(33vh, 25vw)";
  } else {
    return hasHours ? "min(25vh, 11vw)" : "min(25vh, 18vw)";
  }
}

/**
 * Calculate adaptive spacing between timers based on font size
 * This ensures spacing is proportional to actual timer size
 *
 * @param width - Window width in pixels
 * @param height - Window height in pixels
 * @returns Spacing in vh units
 */
export function getTimerSpacing(width: number, height: number): number {
  // Get the active timer font size calculation (without hours: "00:00")
  // From getFontSize: isActive ? "min(33vh, 25vw)"
  const fontSizeVh = 33;
  const fontSizeVw = 25;

  // Calculate actual font size in vh (whichever is smaller)
  const vwInVh = (fontSizeVw * width) / ((100 * height) / 100);
  const actualFontSizeVh = Math.min(fontSizeVh, vwInVh);

  // Spacing should be slightly larger than font size (add ~30% padding)
  // This ensures timers are close but not overlapping
  const spacing = actualFontSizeVh * 1.3;

  // Clamp between reasonable values
  return Math.max(15, Math.min(35, spacing));
}
