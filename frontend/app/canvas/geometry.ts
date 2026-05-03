import {
  GRID_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MIN_NODE_SIZE,
  TEXT_NODE_LINE_HEIGHT,
} from "./constants";
import type {
  Bounds,
  CanvasNode,
  ResizeHandle,
  Size,
  TextCanvasNode,
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
export function getScaledFontSize(node: TextCanvasNode, size: Size): number {
  const widthScale = size.width / node.baseWidth;
  const heightScale = size.height / node.baseHeight;
  const nextFontSize = node.baseFontSize * Math.min(widthScale, heightScale);

  return clamp(Math.round(nextFontSize), MIN_FONT_SIZE, MAX_FONT_SIZE);
}

/**
 * Derives the outer node box for a hug-sized text node from its typography and
 * surface spacing properties.
 */
export function getTextNodeSize(
  input: Pick<
    TextCanvasNode,
    "fontSize" | "fontWeight" | "paddingX" | "paddingY" | "value"
  >,
): Size {
  const lines = input.value.split("\n");
  const maxLineLength = lines.reduce(
    (maxLength, line) => Math.max(maxLength, line.length),
    0,
  );
  const weightScale = input.fontWeight >= 700 ? 0.64 : 0.6;
  const textWidth = Math.ceil(maxLineLength * input.fontSize * weightScale);
  const textHeight = Math.ceil(
    lines.length * input.fontSize * TEXT_NODE_LINE_HEIGHT,
  );

  return {
    width: textWidth + input.paddingX * 2,
    height: textHeight + input.paddingY * 2,
  };
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
  const nextLeft = doesHandleMoveLeftEdge(handle)
    ? Math.min(snapToGrid(x + deltaX), right - MIN_NODE_SIZE)
    : x;
  const nextRight = doesHandleMoveRightEdge(handle)
    ? Math.max(snapToGrid(right + deltaX), x + MIN_NODE_SIZE)
    : right;
  const nextTop = doesHandleMoveTopEdge(handle)
    ? Math.min(snapToGrid(y + deltaY), bottom - MIN_NODE_SIZE)
    : y;
  const nextBottom = doesHandleMoveBottomEdge(handle)
    ? Math.max(snapToGrid(bottom + deltaY), y + MIN_NODE_SIZE)
    : bottom;

  return {
    x: nextLeft,
    y: nextTop,
    width: nextRight - nextLeft,
    height: nextBottom - nextTop,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function doesHandleMoveLeftEdge(handle: ResizeHandle): boolean {
  return handle === "top-left" || handle === "bottom-left";
}

function doesHandleMoveRightEdge(handle: ResizeHandle): boolean {
  return handle === "top-right" || handle === "bottom-right";
}

function doesHandleMoveTopEdge(handle: ResizeHandle): boolean {
  return handle === "top-left" || handle === "top-right";
}

function doesHandleMoveBottomEdge(handle: ResizeHandle): boolean {
  return handle === "bottom-left" || handle === "bottom-right";
}
