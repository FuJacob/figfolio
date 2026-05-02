"use client";

import { PointerEvent, useReducer } from "react";

import {
  canvasReducer,
  initialCanvasState,
} from "@/components/nodes/node-interactions";
import { ImageNodeContent } from "@/components/nodes/renderers/ImageNodeContent";
import { TextNodeContent } from "@/components/nodes/renderers/TextNodeContent";
import type { NodeBounds, PortfolioNode, ResizeHandle } from "@/components/nodes/types";

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
      className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground"
      onPointerDown={handleCanvasPointerDown}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#c5c5c5_2.5px,transparent_0)] bg-[length:40px_40px]"
      />
      <section
        aria-label="Portfolio canvas"
        className="relative min-h-[100dvh] min-w-[900px]"
      >
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
