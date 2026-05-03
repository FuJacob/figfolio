import { GRID_DOT_COLOR, GRID_DOT_SIZE, GRID_SIZE } from "../constants";

export function CanvasGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(${GRID_DOT_COLOR} ${GRID_DOT_SIZE}px, transparent 1px)`,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: `${-GRID_SIZE / 2}px ${-GRID_SIZE / 2}px`,
      }}
    />
  );
}
