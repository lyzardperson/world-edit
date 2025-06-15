/**
 * Viewport Layout Management Constants
 * High-quality configuration constants for viewport resize operations
 */

/** Delay in milliseconds to wait after toolbar actions before triggering viewport resize */
export const VIEWPORT_RESIZE_DEBOUNCE_DELAY = 1000;

/** Default gap size in rem units for grid layouts */
export const DEFAULT_GRID_GAP_REM = 0.125; // gap-0.5

/** Minimum viewport dimensions to ensure valid rendering */
export const MIN_VIEWPORT_DIMENSIONS = {
  width: 100,
  height: 100,
} as const;

/** Animation durations for layout transitions */
export const LAYOUT_ANIMATION_DURATION = {
  /** Duration for viewport entry/exit animations */
  VIEWPORT_TRANSITION: 300,
  /** Duration for layout change animations */
  LAYOUT_CHANGE: 200,
  /** Delay before blink animation starts */
  BLINK_DELAY: 100,
} as const;
