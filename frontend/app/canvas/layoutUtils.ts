import type { CanvasNode } from "./types";

export type LayoutFrame = {
  left: number;
  top: number;
  width: number;
};

export type LayoutRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type LayoutBlock = {
  bounds: LayoutRect;
  nodes: CanvasNode[];
};

export type StackAlignment = "center" | "end" | "start";

type StackAxisOptions = {
  gap: number;
  x: number;
  y: number;
};

type HStackOptions = StackAxisOptions & {
  align?: StackAlignment;
};

type VStackOptions = StackAxisOptions & {
  align?: StackAlignment;
  width?: number;
};

/**
 * Aligns a child width against the end edge of a frame while allowing a
 * negative inset for intentional overflow.
 */
export function alignEnd(
  frame: Pick<LayoutFrame, "left" | "width">,
  itemWidth: number,
  inset = 0,
): number {
  return frame.left + frame.width - itemWidth - inset;
}

export function below(rect: LayoutRect, gap: number): number {
  return rect.y + rect.height + gap;
}

export function createBlock(nodes: CanvasNode[]): LayoutBlock {
  return {
    nodes,
    bounds: getNodesBounds(nodes),
  };
}

export function getNodeBounds(node: CanvasNode): LayoutRect {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
}

export function getNodesBounds(nodes: CanvasNode[]): LayoutRect {
  if (nodes.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const firstNodeBounds = getNodeBounds(nodes[0]);
  let minX = firstNodeBounds.x;
  let minY = firstNodeBounds.y;
  let maxX = firstNodeBounds.x + firstNodeBounds.width;
  let maxY = firstNodeBounds.y + firstNodeBounds.height;

  for (const node of nodes.slice(1)) {
    const bounds = getNodeBounds(node);

    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Positions a node by its top-left corner and preserves the node payload.
 */
export function moveNode(node: CanvasNode, x: number, y: number): CanvasNode {
  return {
    ...node,
    x,
    y,
  };
}

/**
 * Repositions every node in a block relative to the block's current origin.
 */
export function moveBlock(
  block: LayoutBlock,
  x: number,
  y: number,
): LayoutBlock {
  const deltaX = x - block.bounds.x;
  const deltaY = y - block.bounds.y;

  return createBlock(
    block.nodes.map((node) => moveNode(node, node.x + deltaX, node.y + deltaY)),
  );
}

export function right(rect: Pick<LayoutRect, "x" | "width">): number {
  return rect.x + rect.width;
}

/**
 * Lays out blocks horizontally while keeping cross-axis alignment explicit.
 */
export function hStack(
  blocks: LayoutBlock[],
  { align = "start", gap, x, y }: HStackOptions,
): LayoutBlock {
  if (blocks.length === 0) {
    return {
      bounds: { x, y, width: 0, height: 0 },
      nodes: [],
    };
  }

  const maxHeight = Math.max(...blocks.map((block) => block.bounds.height));
  let currentX = x;
  const positioned: CanvasNode[] = [];

  for (const block of blocks) {
    const offsetY =
      align === "center"
        ? y + Math.round((maxHeight - block.bounds.height) / 2)
        : align === "end"
          ? y + maxHeight - block.bounds.height
          : y;
    const moved = moveBlock(block, currentX, offsetY);

    positioned.push(...moved.nodes);
    currentX += block.bounds.width + gap;
  }

  return createBlock(positioned);
}

/**
 * Lays out blocks vertically within an optional section width for end/center
 * alignment.
 */
export function vStack(
  blocks: LayoutBlock[],
  { align = "start", gap, width, x, y }: VStackOptions,
): LayoutBlock {
  if (blocks.length === 0) {
    return {
      bounds: { x, y, width: 0, height: 0 },
      nodes: [],
    };
  }

  const stackWidth =
    width ?? Math.max(...blocks.map((block) => block.bounds.width));
  let currentY = y;
  const positioned: CanvasNode[] = [];

  for (const block of blocks) {
    const offsetX =
      align === "center"
        ? x + Math.round((stackWidth - block.bounds.width) / 2)
        : align === "end"
          ? x + stackWidth - block.bounds.width
          : x;
    const moved = moveBlock(block, offsetX, currentY);

    positioned.push(...moved.nodes);
    currentY += block.bounds.height + gap;
  }

  return createBlock(positioned);
}

export function withTop(
  frame: Pick<LayoutFrame, "left" | "width">,
  top: number,
): LayoutFrame {
  return {
    left: frame.left,
    top,
    width: frame.width,
  };
}
