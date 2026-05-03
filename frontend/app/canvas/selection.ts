import type { Bounds, CanvasNode } from "./types";

/**
 * Returns the editor-space bounds the shared selection overlay should use for
 * the given node.
 */
export function getSelectionBounds(node: CanvasNode): Bounds {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
}
