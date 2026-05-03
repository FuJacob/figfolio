import { type PointerEvent, useState } from "react";
import { getResizedBounds } from "../geometry";
import { useCanvasStore } from "../store";
import type {
  CanvasNode,
  NodeInteraction,
  ResizeHandle,
  ViewportPoint,
} from "../types";

export function useNodeInteraction(node: CanvasNode) {
  const moveNode = useCanvasStore((state) => state.moveNode);
  const resizeNode = useCanvasStore((state) => state.resizeNode);
  const selectNode = useCanvasStore((state) => state.selectNode);
  const [interaction, setInteraction] = useState<NodeInteraction | null>(null);

  function handleNodePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    selectNode(node.id);

    setInteraction({
      mode: "drag",
      nodeId: node.id,
      pointerId: event.pointerId,
      startPointer: getViewportPoint(event),
      startNodePosition: { x: node.x, y: node.y },
    });
  }

  function handleNodePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      interaction?.mode !== "drag" ||
      interaction.pointerId !== event.pointerId
    ) {
      return;
    }

    const pointer = getViewportPoint(event);

    moveNode(interaction.nodeId, {
      x:
        interaction.startNodePosition.x +
        pointer.x -
        interaction.startPointer.x,
      y:
        interaction.startNodePosition.y +
        pointer.y -
        interaction.startPointer.y,
    });
  }

  function handleNodePointerUp(event: PointerEvent<HTMLDivElement>) {
    endInteraction(event.currentTarget, event.pointerId);
  }

  function handleResizePointerDown(
    handle: ResizeHandle,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    selectNode(node.id);

    setInteraction({
      mode: "resize",
      handle,
      nodeId: node.id,
      pointerId: event.pointerId,
      startPointer: getViewportPoint(event),
      startNode: node,
    });
  }

  function handleResizePointerMove(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (
      interaction?.mode !== "resize" ||
      interaction.pointerId !== event.pointerId
    ) {
      return;
    }

    resizeNode(
      interaction.nodeId,
      getResizedBounds({
        handle: interaction.handle,
        pointer: getViewportPoint(event),
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
    handleNodePointerDown,
    handleNodePointerMove,
    handleNodePointerUp,
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
