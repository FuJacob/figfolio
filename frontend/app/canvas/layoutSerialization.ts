import type { CanvasLayout, CanvasLayouts, CanvasNode } from "./types";

/**
 * Returns a deterministic layout object with node records ordered by render
 * order so exported snapshots stay stable between copy operations.
 */
export function normalizeLayout(layout: CanvasLayout): CanvasLayout {
  return {
    nodeIds: [...layout.nodeIds],
    nodes: Object.fromEntries(
      layout.nodeIds
        .map((nodeId) => {
          const node = layout.nodes[nodeId];

          return node ? [nodeId, cloneNode(node)] : null;
        })
        .filter((entry): entry is [string, CanvasNode] => entry !== null),
    ),
  };
}

export function serializeLayout(layout: CanvasLayout): string {
  return JSON.stringify(normalizeLayout(layout), null, 2);
}

export function serializeLayoutPresetsModule(layouts: CanvasLayouts): string {
  const desktopLayout = serializeLayout(layouts.desktop);
  const mobileLayout = serializeLayout(layouts.mobile);

  return `import type { CanvasLayout, CanvasNode, CanvasNodeId } from "./types";

const DESKTOP_LAYOUT: CanvasLayout = ${desktopLayout};

const MOBILE_LAYOUT: CanvasLayout = ${mobileLayout};

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
  desktop: DESKTOP_LAYOUT,
  mobile: MOBILE_LAYOUT,
} as const;
`;
}

function cloneNode(node: CanvasNode): CanvasNode {
  return { ...node };
}
