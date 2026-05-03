import {
  GRID_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MIN_NODE_SIZE,
} from "./constants";
import type {
  Bounds,
  CanvasNode,
  ResizeHandle,
  Size,
  ViewportPoint,
} from "./types";

type ResizeBoundsInput = {
  handle: ResizeHandle;
  pointer: ViewportPoint;
  startNode: CanvasNode;
  startPointer: ViewportPoint;
};

/**
 * Returns the closest pegboard coordinate for the given canvas position.
 */
export function snapToGrid(position: number): number {
  return Math.round(position / GRID_SIZE) * GRID_SIZE;
}

export function snapSize(size: number): number {
  return Math.max(MIN_NODE_SIZE, snapToGrid(size));
}

/**
 * Scales text from the node's base dimensions so repeated resize gestures do
 * not compound rounding error into the stored font size.
 */
export function getScaledFontSize(node: CanvasNode, size: Size): number {
  const widthScale = size.width / node.baseWidth;
  const heightScale = size.height / node.baseHeight;
  const nextFontSize = node.baseFontSize * Math.min(widthScale, heightScale);

  return clamp(Math.round(nextFontSize), MIN_FONT_SIZE, MAX_FONT_SIZE);
}

/**
 * Returns snapped bounds for a corner resize while keeping the opposite corner
 * fixed. That matches how design-tool selection boxes usually behave.
 */
export function getResizedBounds({
  handle,
  pointer,
  startNode,
  startPointer,
}: ResizeBoundsInput): Bounds {
  const deltaX = pointer.x - startPointer.x;
  const deltaY = pointer.y - startPointer.y;
  const { x, y, width, height } = startNode;
  const right = x + width;
  const bottom = y + height;

  switch (handle) {
    case "top-left": {
      const nextX = Math.min(snapToGrid(x + deltaX), right - MIN_NODE_SIZE);
      const nextY = Math.min(snapToGrid(y + deltaY), bottom - MIN_NODE_SIZE);

      return {
        x: nextX,
        y: nextY,
        width: right - nextX,
        height: bottom - nextY,
      };
    }
    case "top-right": {
      const nextRight = Math.max(
        snapToGrid(right + deltaX),
        x + MIN_NODE_SIZE,
      );
      const nextY = Math.min(snapToGrid(y + deltaY), bottom - MIN_NODE_SIZE);

      return {
        x,
        y: nextY,
        width: nextRight - x,
        height: bottom - nextY,
      };
    }
    case "bottom-left": {
      const nextX = Math.min(snapToGrid(x + deltaX), right - MIN_NODE_SIZE);
      const nextBottom = Math.max(
        snapToGrid(bottom + deltaY),
        y + MIN_NODE_SIZE,
      );

      return {
        x: nextX,
        y,
        width: right - nextX,
        height: nextBottom - y,
      };
    }
    case "bottom-right": {
      const nextRight = Math.max(
        snapToGrid(right + deltaX),
        x + MIN_NODE_SIZE,
      );
      const nextBottom = Math.max(
        snapToGrid(bottom + deltaY),
        y + MIN_NODE_SIZE,
      );

      return {
        x,
        y,
        width: nextRight - x,
        height: nextBottom - y,
      };
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
