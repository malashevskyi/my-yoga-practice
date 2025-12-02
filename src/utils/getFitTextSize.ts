/**
 * Calculates a font size that fits within a specific width and height constraint.
 *
 * @param textLength - The number of characters in the string.
 * @param maxHeightVh - The desired height in vh (e.g., 15).
 * @param maxWidthVw - The maximum width the text should occupy in vw (e.g., 90).
 * @param charAspectRatio - Approx width-to-height ratio of a character (0.6 is standard for numbers).
 * @param minSizePx - Minimum font size in pixels (default 40px).
 * @returns CSS clamp() string (e.g., "clamp(40px, min(15vh, 12.5vw), 100vw)")
 */
export function getFitTextSize(
  textLength: number,
  maxHeightVh: number,
  maxWidthVw: number = 90, // Default: take up to 90% of screen width
  charAspectRatio: number = 0.6, // Default: numbers are usually ~0.6em wide
  minSizePx: number = 70, // Default: minimum 40px font size
): string {
  // Formula: Font Size = Available Width / (Char Count * Char Width)
  const calculatedVw = maxWidthVw / (textLength * charAspectRatio);

  // Use clamp: minimum 40px, preferred size (smaller of height or width), max 100vw
  return `clamp(${minSizePx}px, min(${maxHeightVh}vh, ${calculatedVw}vw), 100vw)`;
}
