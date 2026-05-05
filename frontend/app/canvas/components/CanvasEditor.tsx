"use client";

import { useEffect } from "react";
import { CanvasViewportProvider } from "../CanvasViewportContext";
import { useCanvasViewportTransform } from "../hooks/useCanvasViewportTransform";
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
  const layout = useCanvasStore((state) => state.layouts[state.activeLayout]);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectedNode = useCanvasStore((state) =>
    state.selectedNodeId
      ? state.layouts[state.activeLayout].nodes[state.selectedNodeId] ?? null
      : null,
  );
  const setActiveLayout = useCanvasStore((state) => state.setActiveLayout);
  const viewport = useCanvasViewportTransform(layout.frame);

  useEffect(() => {
    setActiveLayout(layoutMode);
  }, [layoutMode, setActiveLayout]);

  return (
    <CanvasViewportProvider value={viewport}>
      <main
        aria-label="Figfolio canvas"
        className="relative h-screen w-screen overflow-auto bg-slate-50"
        onPointerDown={clearSelection}
      >
        <CanvasGrid />
        <div
          className="relative z-10 w-full"
          style={{ minHeight: viewport.scrollHeight }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left overflow-visible"
            style={{
              height: layout.frame.height,
              transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
              width: layout.frame.width,
            }}
          >
            <div className="relative h-full w-full">
              {layout.nodeIds.map((nodeId) => (
                <CanvasNode key={nodeId} nodeId={nodeId} />
              ))}
              {selectedNode ? <SelectionOverlay node={selectedNode} /> : null}
              <FakeCursorOverlay />
            </div>
          </div>
        </div>
        <CanvasDevTools />
        <SocialDock />
      </main>
    </CanvasViewportProvider>
  );
}
