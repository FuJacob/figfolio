import type { ResizeHandle } from "./types";

export const GRID_SIZE = 20;
export const GRID_DOT_COLOR = "#cbd5e1";
export const GRID_DOT_SIZE = 2;
export const DESKTOP_LAYOUT_MIN_WIDTH = 768;
export const IMAGE_NODE_FRAME_PADDING = 10;
export const IMAGE_NODE_FRAME_RADIUS = 32;
export const IMAGE_NODE_CONTENT_RADIUS =
  IMAGE_NODE_FRAME_RADIUS - IMAGE_NODE_FRAME_PADDING;
export const MIN_NODE_SIZE = GRID_SIZE * 2;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 96;
export const TEXT_NODE_LINE_HEIGHT = 1.2;
export const FAKE_CURSOR_COUNT = 1;
export const FAKE_CURSOR_SIZE = 30;
export const FAKE_CURSOR_RETARGET_INTERVAL_MS = 10000;
export const FAKE_CURSOR_MIN_GLIDE_MS = 1600;
export const FAKE_CURSOR_MAX_GLIDE_MS = 2400;
export const FAKE_CURSOR_TARGET_INSET = 20;
export const FAKE_CURSOR_LABEL = "Jacob";
export const FAKE_CURSOR_FILL = "#ef4444";
export const FAKE_CURSOR_IDLE_ROTATION_DEGREES = -6;
export const FAKE_CURSOR_BASE_SCALE = 1;
export const FAKE_CURSOR_MAX_TILT_DEGREES = 12;
export const FAKE_CURSOR_TRAVEL_TILT_BOOST_DEGREES = 6;
export const FAKE_CURSOR_POSE_SETTLE_MS = 420;
export const FAKE_CURSOR_MOVE_SCALE_BOOST = 0.06;

export const RESIZE_HANDLES = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const satisfies readonly ResizeHandle[];
