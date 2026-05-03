import { TEXT_NODE_LINE_HEIGHT } from "../constants";
import type { TextCanvasNode } from "../types";
import { CanvasNodeFrame } from "./CanvasNodeFrame";

type CanvasTextNodeViewProps = {
  isSelected: boolean;
  node: TextCanvasNode;
};

export function CanvasTextNodeView({
  isSelected,
  node,
}: CanvasTextNodeViewProps) {
  return (
    <CanvasNodeFrame
      isSelected={isSelected}
      node={node}
      title={`${node.value} (${node.x}, ${node.y})`}
    >
      <div
        className="h-full w-full overflow-hidden whitespace-pre-wrap"
        style={{
          fontSize: node.fontSize,
          lineHeight: TEXT_NODE_LINE_HEIGHT,
        }}
      >
        {node.value}
      </div>
    </CanvasNodeFrame>
  );
}
