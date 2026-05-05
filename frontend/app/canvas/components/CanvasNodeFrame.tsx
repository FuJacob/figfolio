import type { PropsWithChildren } from "react";
import { useNodeInteraction } from "../hooks/useNodeInteraction";
import type { CanvasNode } from "../types";

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
      className="absolute select-none overflow-visible text-slate-950"
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
    </div>
  );
}
