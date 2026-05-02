"use client";

import { PointerEvent, useReducer } from "react";

import { FakeCursorOverlay } from "@/components/cursors/FakeCursorOverlay";
import {
  canvasReducer,
  initialCanvasState,
} from "@/components/nodes/node-interactions";
import { ImageNodeContent } from "@/components/nodes/renderers/ImageNodeContent";
import { TextNodeContent } from "@/components/nodes/renderers/TextNodeContent";
import type { NodeBounds, PortfolioNode, ResizeHandle } from "@/components/nodes/types";
import { SocialDock } from "@/components/SocialDock";

import { NodeFrame } from "./NodeFrame";

/**
 * PortfolioCanvas owns the interactive editor state.
 *
 * Keeping this as a client component preserves the default server-component
 * behavior for the page while isolating pointer-heavy UI logic in one place.
 */
export function PortfolioCanvas() {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

  function handleCanvasPointerDown() {
    dispatch({ type: "clearSelection" });
  }

  function handleNodePointerDown(
    event: PointerEvent<HTMLElement>,
    node: PortfolioNode,
  ) {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({
      type: "startDrag",
      nodeId: node.id,
      pointerId: event.pointerId,
      pointer: getPointerPosition(event),
      bounds: getNodeBounds(node),
    });
  }

  function handleResizePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    node: PortfolioNode,
    handle: ResizeHandle,
  ) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({
      type: "startResize",
      nodeId: node.id,
      pointerId: event.pointerId,
      handle,
      pointer: getPointerPosition(event),
      bounds: getNodeBounds(node),
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: "movePointer",
      pointerId: event.pointerId,
      pointer: getPointerPosition(event),
    });
  }

  function handlePointerEnd(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "endPointer", pointerId: event.pointerId });
  }

  return (
    <main
      className="grid h-[100dvh] overflow-hidden bg-stage-surround text-foreground"
      onPointerDown={handleCanvasPointerDown}
    >
      <section
        aria-label="Mobile portfolio canvas"
        className="relative isolate h-full w-full max-w-[430px] justify-self-center overflow-hidden bg-background text-foreground sm:shadow-[var(--stage-shadow)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-canvas-grid-dot)_1.5px,transparent_0)] bg-[length:32px_32px]"
        />
        <div className="relative h-full w-full overflow-hidden">
          {state.nodes.map((node) => (
            <NodeFrame
              key={node.id}
              node={node}
              isInteracting={state.interaction?.nodeId === node.id}
              isSelected={state.selectedNodeId === node.id}
              onNodePointerDown={handleNodePointerDown}
              onPointerCancel={handlePointerEnd}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onResizePointerDown={handleResizePointerDown}
            >
              {node.kind === "text" ? (
                <TextNodeContent node={node} />
              ) : (
                <ImageNodeContent node={node} />
              )}
            </NodeFrame>
          ))}
        </div>
        <FakeCursorOverlay />
        <SocialDock />
      </section>
    </main>
  );
}

function getPointerPosition(event: PointerEvent<HTMLElement>): { x: number; y: number } {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function getNodeBounds(node: PortfolioNode): NodeBounds {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
}
