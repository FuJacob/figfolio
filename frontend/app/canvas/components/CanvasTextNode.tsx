import { TEXT_NODE_LINE_HEIGHT } from "../constants";
import { useTextNodeMeasurement } from "../hooks/useTextNodeMeasurement";
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
  const contentRef = useTextNodeMeasurement(node);

  return (
    <CanvasNodeFrame
      isSelected={isSelected}
      node={node}
      title={`${node.value} (${node.x}, ${node.y})`}
    >
      <div
        ref={contentRef}
        className="whitespace-pre-wrap"
        style={{
          backgroundColor: node.backgroundColor,
          borderRadius: node.borderRadius,
          color: node.textColor,
          display: node.sizingMode === "hug" ? "inline-block" : "block",
          fontSize: node.fontSize,
          fontWeight: node.fontWeight,
          lineHeight: TEXT_NODE_LINE_HEIGHT,
          minHeight: node.sizingMode === "fixed" ? "100%" : undefined,
          overflow: node.sizingMode === "fixed" ? "hidden" : "visible",
          overflowWrap: node.sizingMode === "fixed" ? undefined : "break-word",
          padding: `${node.paddingY}px ${node.paddingX}px`,
          width:
            node.sizingMode === "hug"
              ? "fit-content"
              : node.sizingMode === "wrap"
                ? "100%"
                : "100%",
        }}
      >
        {node.value}
      </div>
    </CanvasNodeFrame>
  );
}
