import {
  FAKE_CURSOR_BASE_SCALE,
  FAKE_CURSOR_COUNT,
  FAKE_CURSOR_FILL,
  FAKE_CURSOR_IDLE_ROTATION_DEGREES,
  FAKE_CURSOR_LABEL,
  FAKE_CURSOR_MAX_GLIDE_MS,
  FAKE_CURSOR_MAX_TILT_DEGREES,
  FAKE_CURSOR_MIN_GLIDE_MS,
  FAKE_CURSOR_MOVE_SCALE_BOOST,
  FAKE_CURSOR_TARGET_INSET,
  FAKE_CURSOR_TRAVEL_TILT_BOOST_DEGREES,
} from "./constants";
import type { Bounds, CanvasLayout, CanvasNodeId, CanvasPoint } from "./types";

type RandomFn = () => number;

export type FakeCursorAgent = {
  color: string;
  glideMs: number;
  id: string;
  label: string;
  nodeId: CanvasNodeId;
  position: CanvasPoint;
  rotation: number;
  scale: number;
  settleRotation: number;
  settleScale: number;
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
      glideMs: randomBetween(
        FAKE_CURSOR_MIN_GLIDE_MS,
        FAKE_CURSOR_MAX_GLIDE_MS,
        random,
      ),
      id: `fake-cursor-${index + 1}`,
      label: FAKE_CURSOR_LABEL,
      nodeId,
      position: pickPointWithinBounds(node, random),
      rotation: FAKE_CURSOR_IDLE_ROTATION_DEGREES,
      scale: FAKE_CURSOR_BASE_SCALE,
      settleRotation: FAKE_CURSOR_IDLE_ROTATION_DEGREES,
      settleScale: FAKE_CURSOR_BASE_SCALE,
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
    const pose = getDirectionalPose(cursor.position, position);

    return {
      ...cursor,
      glideMs: randomBetween(
        FAKE_CURSOR_MIN_GLIDE_MS,
        FAKE_CURSOR_MAX_GLIDE_MS,
        random,
      ),
      nodeId,
      position,
      rotation: pose.travelRotation,
      scale: pose.travelScale,
      settleRotation: pose.settleRotation,
      settleScale: pose.settleScale,
    };
  });
}

/**
 * Returns a random point inside the node with a safety inset so cursors land
 * in believable interior positions instead of hugging the exact edges.
 */
function pickPointWithinBounds(
  bounds: Bounds,
  random: RandomFn,
): CanvasPoint {
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

/**
 * Computes a cursor pose that banks into the direction of travel, then settles
 * into a softer resting angle once the move is underway.
 */
function getDirectionalPose(
  from: CanvasPoint,
  to: CanvasPoint,
): {
  settleRotation: number;
  settleScale: number;
  travelRotation: number;
  travelScale: number;
} {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance < 1) {
    return {
      settleRotation: FAKE_CURSOR_IDLE_ROTATION_DEGREES,
      settleScale: FAKE_CURSOR_BASE_SCALE,
      travelRotation: FAKE_CURSOR_IDLE_ROTATION_DEGREES,
      travelScale: FAKE_CURSOR_BASE_SCALE,
    };
  }

  const normalizedX = deltaX / distance;
  const normalizedY = deltaY / distance;
  const settleRotation = clamp(
    FAKE_CURSOR_IDLE_ROTATION_DEGREES +
      normalizedX * FAKE_CURSOR_MAX_TILT_DEGREES -
      normalizedY * 4,
    FAKE_CURSOR_IDLE_ROTATION_DEGREES - FAKE_CURSOR_MAX_TILT_DEGREES,
    FAKE_CURSOR_IDLE_ROTATION_DEGREES + FAKE_CURSOR_MAX_TILT_DEGREES,
  );

  return {
    settleRotation,
    settleScale: FAKE_CURSOR_BASE_SCALE,
    travelRotation: settleRotation + normalizedX * FAKE_CURSOR_TRAVEL_TILT_BOOST_DEGREES,
    travelScale:
      FAKE_CURSOR_BASE_SCALE +
      Math.min(distance / 480, 1) * FAKE_CURSOR_MOVE_SCALE_BOOST,
  };
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
  const nodeId = availableNodeIds[Math.floor(random() * availableNodeIds.length)];

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

function randomBetween(min: number, max: number, random: RandomFn): number {
  return min + (max - min) * random();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
