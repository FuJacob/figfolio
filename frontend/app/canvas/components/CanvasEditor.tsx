"use client";

import { useEffect } from "react";
import { useResponsiveLayoutMode } from "../hooks/useResponsiveLayoutMode";
import { useCanvasStore } from "../store";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasNode } from "./CanvasNode";

export function CanvasEditor() {
  const layoutMode = useResponsiveLayoutMode();
  const nodeIds = useCanvasStore(
    (state) => state.layouts[state.activeLayout].nodeIds,
  );
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const setActiveLayout = useCanvasStore((state) => state.setActiveLayout);

  useEffect(() => {
    setActiveLayout(layoutMode);
  }, [layoutMode, setActiveLayout]);

  return (
    <main
      aria-label="Figfolio canvas"
      className="relative h-screen w-screen overflow-hidden bg-slate-50"
      onPointerDown={clearSelection}
    >
      <CanvasGrid />

      <div className="relative h-full w-full">
        {nodeIds.map((nodeId) => (
          <CanvasNode key={nodeId} nodeId={nodeId} />
        ))}
      </div>
    </main>
  );
}
