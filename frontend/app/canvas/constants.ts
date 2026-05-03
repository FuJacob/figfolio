import type { ResizeHandle } from "./types";

export const GRID_SIZE = 20;
export const GRID_DOT_COLOR = "#cbd5e1";
export const GRID_DOT_SIZE = 2;
export const DESKTOP_LAYOUT_MIN_WIDTH = 768;
export const MIN_NODE_SIZE = GRID_SIZE * 2;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 96;
export const TEXT_NODE_LINE_HEIGHT = 1.2;

export const RESIZE_HANDLES = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const satisfies readonly ResizeHandle[];
