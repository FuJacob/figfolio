import { type PointerEvent, useState } from "react";
import { useCanvasViewport } from "../CanvasViewportContext";
import { getResizedBounds } from "../geometry";
import { useCanvasStore } from "../store";
import { viewportPointToCanvasPoint } from "../viewportTransform";
import type { CanvasNode, ResizeHandle, ResizeInteraction, ViewportPoint } from "../types";

/**
 * Owns the temporary pointer state for resizing the currently selected node
 * from the shared editor overlay.
 */
export function useResizeInteraction(node: CanvasNode) {
  const resizeNode = useCanvasStore((state) => state.resizeNode);
  const viewport = useCanvasViewport();
  const [interaction, setInteraction] = useState<ResizeInteraction | null>(null);

  function handleResizePointerDown(
    handle: ResizeHandle,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    setInteraction({
      mode: "resize",
      handle,
      nodeId: node.id,
      pointerId: event.pointerId,
      startPointer: viewportPointToCanvasPoint(getViewportPoint(event), viewport),
      startNode: node,
    });
  }

  function handleResizePointerMove(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    resizeNode(
      interaction.nodeId,
      getResizedBounds({
        handle: interaction.handle,
        pointer: viewportPointToCanvasPoint(getViewportPoint(event), viewport),
        startNode: interaction.startNode,
        startPointer: interaction.startPointer,
      }),
    );
  }

  function handleResizePointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    endInteraction(event.currentTarget, event.pointerId);
  }

  function endInteraction(target: Element, pointerId: number) {
    if (interaction?.pointerId === pointerId) {
      setInteraction(null);
    }

    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }
  }

  return {
    handleResizePointerDown,
    handleResizePointerMove,
    handleResizePointerUp,
  };
}

function getViewportPoint(event: PointerEvent<Element>): ViewportPoint {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}
