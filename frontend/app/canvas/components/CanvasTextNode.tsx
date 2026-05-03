import { RESIZE_HANDLES, TEXT_NODE_LINE_HEIGHT } from "../constants";
import { useNodeInteraction } from "../hooks/useNodeInteraction";
import { useCanvasStore } from "../store";
import type { CanvasNode, CanvasNodeId } from "../types";
import { cx } from "../utils/classNames";
import { ResizeHandleButton } from "./ResizeHandle";

type CanvasTextNodeProps = {
  nodeId: CanvasNodeId;
};

type CanvasTextNodeViewProps = {
  isSelected: boolean;
  node: CanvasNode;
};

export function CanvasTextNode({ nodeId }: CanvasTextNodeProps) {
  const node = useCanvasStore((state) => state.nodes[nodeId]);
  const isSelected = useCanvasStore((state) => state.selectedNodeId === nodeId);

  if (!node) {
    return null;
  }

  return <CanvasTextNodeView isSelected={isSelected} node={node} />;
}

function CanvasTextNodeView({ isSelected, node }: CanvasTextNodeViewProps) {
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
      title={`${node.value} (${node.x}, ${node.y})`}
    >
      <div
        className="h-full w-full overflow-hidden whitespace-pre-wrap "
        style={{
          fontSize: node.fontSize,
          lineHeight: TEXT_NODE_LINE_HEIGHT,
        }}
      >
        {node.value}
      </div>
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
