import type { PropsWithChildren } from "react";
import { RESIZE_HANDLES } from "../constants";
import { useNodeInteraction } from "../hooks/useNodeInteraction";
import type { CanvasNode } from "../types";
import { cx } from "../utils/classNames";
import { ResizeHandleButton } from "./ResizeHandle";

type CanvasNodeFrameProps = PropsWithChildren<{
  isSelected: boolean;
  node: CanvasNode;
  title: string;
}>;

/**
 * Provides the shared draggable and resizable shell for every canvas node
 * type so visual variants can focus on their own content.
 */
export function CanvasNodeFrame({
  children,
  isSelected,
  node,
  title,
}: CanvasNodeFrameProps) {
  const interaction = useNodeInteraction(node);

  return (
    <div
      className={cx(
        "absolute cursor-grab select-none overflow-visible rounded-sm border text-slate-950 active:cursor-grabbing",
        isSelected ? "border-blue-500" : "border-transparent",
      )}
      onPointerCancel={interaction.handleNodePointerUp}
      onPointerDown={interaction.handleNodePointerDown}
      onPointerMove={interaction.handleNodePointerMove}
      onPointerUp={interaction.handleNodePointerUp}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: node.width,
        height: node.height,
        touchAction: "none",
        zIndex: isSelected ? 1 : 0,
      }}
      title={title}
    >
      {children}
      {isSelected
        ? RESIZE_HANDLES.map((handle) => (
            <ResizeHandleButton
              key={handle}
              handle={handle}
              onPointerDown={interaction.handleResizePointerDown}
              onPointerMove={interaction.handleResizePointerMove}
              onPointerUp={interaction.handleResizePointerUp}
            />
          ))
        : null}
    </div>
  );
}
