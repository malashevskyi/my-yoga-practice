import { useEffect, useCallback } from "react";

/**
 * Generates a random unique ID to be used for fixing the ghost elements.
 * @returns A random string prefixed with 'mui-ghost-'.
 */
const generateRandomId = (): string => {
  return "mui-ghost-" + Math.random().toString(36).substring(2, 9);
};

/**
 * Hook to dynamically add unique 'id' and 'name' attributes to hidden MUI elements
 * (like the shadow <textarea> for multiline auto-resize) to suppress linter warnings.
 *
 * @param selector - The CSS selector for the target ghost elements (e.g., 'textarea[aria-hidden="true"].MuiInputBase-inputMultiline').
 */
export const useMuiGhostFix = (selector: string): void => {
  // Function that applies the fix to a single found element
  const applyFix = useCallback((element: Element): void => {
    // Prevent processing the element again
    if (element.hasAttribute("data-fixed")) {
      return;
    }

    const randomId = generateRandomId();

    // Add the required attributes
    element.setAttribute("id", randomId);
    element.setAttribute("name", randomId);

    // Mark the element as fixed
    element.setAttribute("data-fixed", "true");
  }, []); // Dependencies array is empty as inner functions are stable

  useEffect(() => {
    // 1. Fix elements that already exist in the DOM on mount
    document.querySelectorAll<HTMLElement>(selector).forEach(applyFix);

    // 2. Create a MutationObserver to watch for new elements added later
    const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            // Check if the added node is an actual Element
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              // Check if the element itself matches the selector
              if (element.matches(selector)) {
                applyFix(element);
              }
              // Check for children elements (if the added node is a container)
              element.querySelectorAll<HTMLElement>(selector).forEach(applyFix);
            }
          });
        }
      });
    });

    // Configuration: Observe the entire body for added nodes and changes in subtrees
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup function: Disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, [selector, applyFix]);
};
