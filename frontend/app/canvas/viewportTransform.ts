import { CANVAS_VIEWPORT_PADDING } from "./constants";
import type {
  CanvasFrame,
  CanvasPoint,
  CanvasViewportTransform,
  Size,
  ViewportPoint,
} from "./types";

type CanvasViewportTransformInput = {
  frame: CanvasFrame;
  viewport: Size;
};

/**
 * Fits the authored frame to the available viewport width while preserving the
 * document's vertical length for normal page scrolling.
 */
export function getCanvasViewportTransform({
  frame,
  viewport,
}: CanvasViewportTransformInput): CanvasViewportTransform {
  const availableWidth = Math.max(
    viewport.width - CANVAS_VIEWPORT_PADDING * 2,
    1,
  );
  const scale = Math.min(availableWidth / frame.width, 1);
  const renderedWidth = frame.width * scale;
  const renderedHeight = frame.height * scale;
  const offsetX = Math.max((viewport.width - renderedWidth) / 2, 0);
  const offsetY =
    renderedHeight + CANVAS_VIEWPORT_PADDING * 2 <= viewport.height
      ? (viewport.height - renderedHeight) / 2
      : CANVAS_VIEWPORT_PADDING;

  return {
    offsetX,
    offsetY,
    renderedHeight,
    renderedWidth,
    scale,
    scrollHeight: Math.max(
      viewport.height,
      offsetY + renderedHeight + CANVAS_VIEWPORT_PADDING,
    ),
  };
}

/**
 * Converts a raw viewport pointer position into the authored canvas space
 * inside the scaled frame.
 */
export function viewportPointToCanvasPoint(
  point: ViewportPoint,
  transform: CanvasViewportTransform,
): CanvasPoint {
  return {
    x: (point.x - transform.offsetX) / transform.scale,
    y: (point.y - transform.offsetY) / transform.scale,
  };
}
