"use client";

import { useState } from "react";
import { CanvasViewportProvider } from "../CanvasViewportContext";
import { useCanvasViewportTransform } from "../hooks/useCanvasViewportTransform";
import { useCanvasStore } from "../store";
import { CanvasDevTools } from "./CanvasDevTools";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasNode } from "./CanvasNode";
import { FakeCursorOverlay } from "./FakeCursorOverlay";
import { SelectionOverlay } from "./SelectionOverlay";
import { SocialDock } from "./SocialDock";

export function CanvasEditor() {
  const [showDevTools, setShowDevTools] = useState(false);
  const handleDevToolsOpen = () => setShowDevTools(true);
  const layout = useCanvasStore((state) => state.layout);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectedNode = useCanvasStore((state) =>
    state.selectedNodeId ? (state.layout.nodes[state.selectedNodeId] ?? null) : null,
  );
  const viewport = useCanvasViewportTransform(layout.frame);

  return (
    <CanvasViewportProvider value={viewport}>
      <main
        aria-label="Figfolio canvas"
        className="relative h-screen w-screen overflow-auto bg-slate-50"
        onPointerDown={clearSelection}
      >
        <div
          className="relative w-full"
          style={{ minHeight: viewport.scrollHeight }}
        >
          <CanvasGrid />
          <div
            className="absolute left-0 top-0 z-10 origin-top-left overflow-visible"
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
        {showDevTools ? (
          <>
            <button
              className="fixed right-1 top-1 z-50"
              onClick={() => setShowDevTools(false)}
            >
              Close
            </button>
            <CanvasDevTools />
          </>
        ) : (
          <button
            className="fixed right-4 top-4 z-50"
            onClick={handleDevToolsOpen}
          >
            Open
          </button>
        )}
        <SocialDock />
      </main>
    </CanvasViewportProvider>
  );
}
