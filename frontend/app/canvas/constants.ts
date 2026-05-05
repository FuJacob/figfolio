import type { ResizeHandle } from "./types";

export const GRID_SIZE = 20;
export const GRID_DOT_COLOR = "#cbd5e1";
export const GRID_DOT_SIZE = 2;
export const CANVAS_VIEWPORT_PADDING = 24;
export const IMAGE_NODE_FRAME_PADDING = 5;
export const IMAGE_NODE_FRAME_RADIUS = 18;
export const IMAGE_NODE_CONTENT_RADIUS =
  IMAGE_NODE_FRAME_RADIUS - IMAGE_NODE_FRAME_PADDING;
export const MIN_NODE_SIZE = GRID_SIZE * 2;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 96;
export const TEXT_NODE_LINE_HEIGHT = 1.2;
export const FAKE_CURSOR_COUNT = 1;
export const FAKE_CURSOR_RETARGET_INTERVAL_MS = 2000;
export const FAKE_CURSOR_TARGET_INSET = 20;
export const FAKE_CURSOR_FILL = "#ef4444";
export const FAKE_CURSOR_WIDTH = 50;
export const FAKE_CURSOR_HEIGHT = 54;
export const FAKE_CURSOR_RENDER_SCALE = 0.5;
export const FAKE_CURSOR_SPRING_STIFFNESS = 16;
export const FAKE_CURSOR_SPRING_DAMPING = 0.78;
export const FAKE_CURSOR_ROTATION_RESPONSE = 12;
export const FAKE_CURSOR_SCALE_RESPONSE = 18;
export const FAKE_CURSOR_MOVING_SCALE = 0.95;
export const FAKE_CURSOR_IDLE_SCALE = 1;
export const FAKE_CURSOR_MIN_SPEED = 8;

export const RESIZE_HANDLES = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const satisfies readonly ResizeHandle[];
