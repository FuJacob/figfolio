"use client";

import { useCanvasViewport } from "../CanvasViewportContext";
import { GRID_DOT_COLOR, GRID_DOT_SIZE, GRID_SIZE } from "../constants";

const MIN_GRID_DOT_SIZE = 1;

export function CanvasGrid() {
  const viewport = useCanvasViewport();
  const scaledGridSize = GRID_SIZE * viewport.scale;
  const scaledDotSize = Math.max(
    GRID_DOT_SIZE * viewport.scale,
    MIN_GRID_DOT_SIZE,
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(${GRID_DOT_COLOR} ${scaledDotSize}px, transparent ${scaledDotSize}px)`,
        backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
        backgroundPosition: `${viewport.offsetX - scaledGridSize / 2}px ${viewport.offsetY - scaledGridSize / 2}px`,
      }}
    />
  );
}
