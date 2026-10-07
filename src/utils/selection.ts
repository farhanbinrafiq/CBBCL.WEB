// True when the user has just selected text (e.g. to copy a name). Clickable cards
// check this so a click-drag selection doesn't navigate away.
export function hasTextSelection(): boolean {
  if (typeof window === "undefined") return false;
  const selection = window.getSelection();
  return !!selection && selection.toString().trim().length > 0;
}
