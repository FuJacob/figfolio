import {
  FAKE_CURSOR_COUNT,
  FAKE_CURSOR_FILL,
  FAKE_CURSOR_TARGET_INSET,
} from "./constants";
import type { Bounds, CanvasLayout, CanvasNodeId, CanvasPoint } from "./types";

type RandomFn = () => number;

export type FakeCursorAgent = {
  color: string;
  id: string;
  nodeId: CanvasNodeId;
  position: CanvasPoint;
};

/**
 * Creates the initial decorative cursor set for the active layout.
 */
export function createFakeCursorAgents(
  layout: CanvasLayout,
  random: RandomFn = Math.random,
): FakeCursorAgent[] {
  if (layout.nodeIds.length === 0) {
    return [];
  }

  const usedNodeIds = new Set<CanvasNodeId>();

  return Array.from({ length: FAKE_CURSOR_COUNT }, (_, index) => {
    const nodeId = pickNodeId(layout, usedNodeIds, null, random);
    const node = layout.nodes[nodeId];

    return {
      color: FAKE_CURSOR_FILL,
      id: `fake-cursor-${index + 1}`,
      nodeId,
      position: pickPointWithinBounds(node, random),
    };
  });
}

/**
 * Chooses the next targets for each cursor while trying to avoid sending two
 * cursors to the same node when enough nodes are available.
 */
export function retargetFakeCursorAgents(
  cursors: readonly FakeCursorAgent[],
  layout: CanvasLayout,
  random: RandomFn = Math.random,
): FakeCursorAgent[] {
  if (layout.nodeIds.length === 0) {
    return [];
  }

  const usedNodeIds = new Set<CanvasNodeId>();

  return cursors.map((cursor) => {
    const nodeId = pickNodeId(layout, usedNodeIds, cursor.nodeId, random);
    const node = layout.nodes[nodeId];
    const position = pickPointWithinBounds(node, random);

    return {
      ...cursor,
      nodeId,
      position,
    };
  });
}

/**
 * Returns a random point inside the node with a safety inset so cursors land
 * in believable interior positions instead of hugging the exact edges.
 */
function pickPointWithinBounds(bounds: Bounds, random: RandomFn): CanvasPoint {
  const insetX = getAxisInset(bounds.width);
  const insetY = getAxisInset(bounds.height);
  const width = Math.max(bounds.width - insetX * 2, 0);
  const height = Math.max(bounds.height - insetY * 2, 0);

  return {
    x: bounds.x + insetX + width * random(),
    y: bounds.y + insetY + height * random(),
  };
}

function getAxisInset(length: number): number {
  return Math.min(FAKE_CURSOR_TARGET_INSET, Math.max(length / 3, 0));
}

function pickNodeId(
  layout: CanvasLayout,
  usedNodeIds: Set<CanvasNodeId>,
  previousNodeId: CanvasNodeId | null,
  random: RandomFn,
): CanvasNodeId {
  const availableNodeIds = pickCandidateNodeIds(
    layout.nodeIds,
    usedNodeIds,
    previousNodeId,
  );
  const nodeId =
    availableNodeIds[Math.floor(random() * availableNodeIds.length)];

  if (layout.nodeIds.length >= FAKE_CURSOR_COUNT) {
    usedNodeIds.add(nodeId);
  }

  return nodeId;
}

function pickCandidateNodeIds(
  nodeIds: readonly CanvasNodeId[],
  usedNodeIds: Set<CanvasNodeId>,
  previousNodeId: CanvasNodeId | null,
): CanvasNodeId[] {
  const withoutPreviousAndUsed = nodeIds.filter(
    (nodeId) => nodeId !== previousNodeId && !usedNodeIds.has(nodeId),
  );

  if (withoutPreviousAndUsed.length > 0) {
    return withoutPreviousAndUsed;
  }

  const withoutUsed = nodeIds.filter((nodeId) => !usedNodeIds.has(nodeId));

  if (withoutUsed.length > 0) {
    return withoutUsed;
  }

  const withoutPrevious = nodeIds.filter((nodeId) => nodeId !== previousNodeId);

  if (withoutPrevious.length > 0) {
    return withoutPrevious;
  }

  return [...nodeIds];
}
