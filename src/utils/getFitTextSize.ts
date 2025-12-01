/**
 * Calculates a font size that fits within a specific width and height constraint.
 *
 * @param textLength - The number of characters in the string.
 * @param maxHeightVh - The desired height in vh (e.g., 15).
 * @param maxWidthVw - The maximum width the text should occupy in vw (e.g., 90).
 * @param charAspectRatio - Approx width-to-height ratio of a character (0.6 is standard for numbers).
 * @returns CSS min() string (e.g., "min(15vh, 12.5vw)")
 */
export function getFitTextSize(
  textLength: number,
  maxHeightVh: number,
  maxWidthVw: number = 90, // Default: take up to 90% of screen width
  charAspectRatio: number = 0.6, // Default: numbers are usually ~0.6em wide
): string {
  // Formula: Font Size = Available Width / (Char Count * Char Width)
  const calculatedVw = maxWidthVw / (textLength * charAspectRatio);

  // Return the smaller of the two: desired height OR calculated width
  return `min(${maxHeightVh}vh, ${calculatedVw}vw)`;
}
