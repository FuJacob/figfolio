import type { CanvasLayout, CanvasNode, CanvasNodeId } from "./types";

const DESKTOP_NODES: CanvasNode[] = [
  {
    id: "headline",
    type: "text",
    x: 80,
    y: 80,
    width: 320,
    height: 60,
    baseWidth: 320,
    baseHeight: 60,
    fontSize: 28,
    baseFontSize: 28,
    value: "Design systems for fast teams",
  },
  {
    id: "subtitle",
    type: "text",
    x: 80,
    y: 160,
    width: 360,
    height: 80,
    baseWidth: 360,
    baseHeight: 80,
    fontSize: 18,
    baseFontSize: 18,
    value: "Ship clean interfaces with reusable components.",
  },
  {
    id: "note",
    type: "text",
    x: 460,
    y: 120,
    width: 220,
    height: 80,
    baseWidth: 220,
    baseHeight: 80,
    fontSize: 16,
    baseFontSize: 16,
    value: "Drag me. I snap every 20px.",
  },
];

const MOBILE_NODES: CanvasNode[] = [
  {
    id: "headline",
    type: "text",
    x: 20,
    y: 120,
    width: 280,
    height: 80,
    baseWidth: 280,
    baseHeight: 80,
    fontSize: 26,
    baseFontSize: 26,
    value: "Design systems for fast teams",
  },
  {
    id: "subtitle",
    type: "text",
    x: 20,
    y: 220,
    width: 280,
    height: 100,
    baseWidth: 280,
    baseHeight: 100,
    fontSize: 18,
    baseFontSize: 18,
    value: "Ship clean interfaces with reusable components.",
  },
  {
    id: "note",
    type: "text",
    x: 40,
    y: 340,
    width: 220,
    height: 80,
    baseWidth: 220,
    baseHeight: 80,
    fontSize: 16,
    baseFontSize: 16,
    value: "Drag me. I snap every 20px.",
  },
];

/**
 * Builds a layout from authored nodes while preserving the intended render
 * order separately from the node record.
 */
function createLayout(nodes: CanvasNode[]): CanvasLayout {
  return {
    nodeIds: nodes.map((node) => node.id),
    nodes: Object.fromEntries(
      nodes.map((node) => [node.id, cloneNode(node)]),
    ) as Record<CanvasNodeId, CanvasNode>,
  };
}

/**
 * Clones a layout preset so editing session state cannot mutate the authored
 * preset objects by reference.
 */
export function cloneLayout(layout: CanvasLayout): CanvasLayout {
  return {
    nodeIds: [...layout.nodeIds],
    nodes: Object.fromEntries(
      Object.entries(layout.nodes).map(([id, node]) => [id, cloneNode(node)]),
    ) as Record<CanvasNodeId, CanvasNode>,
  };
}

function cloneNode(node: CanvasNode): CanvasNode {
  return { ...node };
}

export const LAYOUT_PRESETS = {
  desktop: createLayout(DESKTOP_NODES),
  mobile: createLayout(MOBILE_NODES),
} as const;
