"use client";

import { useCanvasStore } from "../store";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasTextNode } from "./CanvasTextNode";

export function CanvasEditor() {
  const nodeIds = useCanvasStore((state) => state.nodeIds);
  const clearSelection = useCanvasStore((state) => state.clearSelection);

  return (
    <main
      aria-label="Figfolio canvas"
      className="relative h-screen w-screen overflow-hidden bg-slate-50"
      onPointerDown={clearSelection}
    >
      <CanvasGrid />

      <div className="relative h-full w-full">
        {nodeIds.map((nodeId) => (
          <CanvasTextNode key={nodeId} nodeId={nodeId} />
        ))}
      </div>
    </main>
  );
}
