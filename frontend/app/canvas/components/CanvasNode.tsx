import { useCanvasStore } from "../store";
import type { CanvasNodeId } from "../types";
import { CanvasImageNodeView } from "./CanvasImageNode";
import { CanvasTextNodeView } from "./CanvasTextNode";

type CanvasNodeProps = {
  nodeId: CanvasNodeId;
};

/**
 * Looks up the active node record and dispatches to the appropriate visual
 * node renderer for that record type.
 */
export function CanvasNode({ nodeId }: CanvasNodeProps) {
  const node = useCanvasStore((state) => state.layout.nodes[nodeId]);
  const isSelected = useCanvasStore((state) => state.selectedNodeId === nodeId);

  if (!node) {
    return null;
  }

  switch (node.type) {
    case "text":
      return <CanvasTextNodeView isSelected={isSelected} node={node} />;
    case "image":
      return <CanvasImageNodeView isSelected={isSelected} node={node} />;
  }
}
