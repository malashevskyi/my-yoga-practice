export function getFontSize(isActive: boolean, textLength: number) {
  const hasHours = textLength > 5; // "00:00:00" vs "00:00"

  if (isActive) {
    return hasHours ? "min(33vh, 16vw)" : "min(33vh, 25vw)";
  } else {
    return hasHours ? "min(25vh, 11vw)" : "min(25vh, 18vw)";
  }
}
