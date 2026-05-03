"use client";

import { useEffect } from "react";
import { useResponsiveLayoutMode } from "../hooks/useResponsiveLayoutMode";
import { useCanvasStore } from "../store";
import { CanvasDevTools } from "./CanvasDevTools";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasNode } from "./CanvasNode";
import { FakeCursorOverlay } from "./FakeCursorOverlay";
import { SelectionOverlay } from "./SelectionOverlay";
import { SocialDock } from "./SocialDock";

export function CanvasEditor() {
  const layoutMode = useResponsiveLayoutMode();
  const nodeIds = useCanvasStore(
    (state) => state.layouts[state.activeLayout].nodeIds,
  );
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectedNode = useCanvasStore((state) =>
    state.selectedNodeId
      ? state.layouts[state.activeLayout].nodes[state.selectedNodeId] ?? null
      : null,
  );
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
        {selectedNode ? <SelectionOverlay node={selectedNode} /> : null}
        <FakeCursorOverlay />
      </div>
      <CanvasDevTools />
      <SocialDock />
    </main>
  );
}
