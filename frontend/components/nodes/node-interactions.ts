import { INITIAL_NODES, MIN_NODE_SIZE } from "./node-data";
import type { NodeBounds, PortfolioNode, ResizeHandle } from "./types";

type PointerPosition = {
  x: number;
  y: number;
};

type DragInteraction = {
  mode: "drag";
  nodeId: string;
  pointerId: number;
  startPointer: PointerPosition;
  startBounds: NodeBounds;
};

type ResizeInteraction = {
  mode: "resize";
  nodeId: string;
  pointerId: number;
  handle: ResizeHandle;
  startPointer: PointerPosition;
  startBounds: NodeBounds;
};

type Interaction = DragInteraction | ResizeInteraction | null;

export type CanvasState = {
  nodes: PortfolioNode[];
  selectedNodeId: string | null;
  interaction: Interaction;
};

export type CanvasAction =
  | { type: "clearSelection" }
  | { type: "selectNode"; nodeId: string }
  | {
      type: "startDrag";
      nodeId: string;
      pointerId: number;
      pointer: PointerPosition;
      bounds: NodeBounds;
    }
  | {
      type: "startResize";
      nodeId: string;
      pointerId: number;
      handle: ResizeHandle;
      pointer: PointerPosition;
      bounds: NodeBounds;
    }
  | { type: "movePointer"; pointerId: number; pointer: PointerPosition }
  | { type: "endPointer"; pointerId: number };

export const initialCanvasState: CanvasState = {
  nodes: INITIAL_NODES,
  selectedNodeId: INITIAL_NODES[0]?.id ?? null,
  interaction: null,
};

export function canvasReducer(
  state: CanvasState,
  action: CanvasAction,
): CanvasState {
  switch (action.type) {
    case "clearSelection":
      return { ...state, selectedNodeId: null, interaction: null };

    case "selectNode":
      return { ...state, selectedNodeId: action.nodeId };

    case "startDrag":
      return {
        ...state,
        selectedNodeId: action.nodeId,
        interaction: {
          mode: "drag",
          nodeId: action.nodeId,
          pointerId: action.pointerId,
          startPointer: action.pointer,
          startBounds: action.bounds,
        },
      };

    case "startResize":
      return {
        ...state,
        selectedNodeId: action.nodeId,
        interaction: {
          mode: "resize",
          nodeId: action.nodeId,
          pointerId: action.pointerId,
          handle: action.handle,
          startPointer: action.pointer,
          startBounds: action.bounds,
        },
      };

    case "movePointer":
      return movePointer(state, action.pointerId, action.pointer);

    case "endPointer":
      if (state.interaction?.pointerId !== action.pointerId) {
        return state;
      }

      return { ...state, interaction: null };

    default:
      return state;
  }
}

function movePointer(
  state: CanvasState,
  pointerId: number,
  pointer: PointerPosition,
): CanvasState {
  const { interaction } = state;

  if (!interaction || interaction.pointerId !== pointerId) {
    return state;
  }

  const deltaX = pointer.x - interaction.startPointer.x;
  const deltaY = pointer.y - interaction.startPointer.y;

  if (interaction.mode === "drag") {
    return updateNodeBounds(state, interaction.nodeId, {
      x: interaction.startBounds.x + deltaX,
      y: interaction.startBounds.y + deltaY,
    });
  }

  const node = state.nodes.find(({ id }) => id === interaction.nodeId);

  if (!node) {
    return { ...state, interaction: null };
  }

  return updateNodeBounds(
    state,
    interaction.nodeId,
    getResizedBounds(interaction, node.kind, deltaX, deltaY),
  );
}

function getResizedBounds(
  interaction: ResizeInteraction,
  kind: PortfolioNode["kind"],
  deltaX: number,
  deltaY: number,
): NodeBounds {
  const minimumSize = MIN_NODE_SIZE[kind];
  const { startBounds } = interaction;
  const growsLeft = interaction.handle === "northWest" || interaction.handle === "southWest";
  const growsUp = interaction.handle === "northWest" || interaction.handle === "northEast";
  const rawWidth = growsLeft
    ? startBounds.width - deltaX
    : startBounds.width + deltaX;
  const rawHeight = growsUp
    ? startBounds.height - deltaY
    : startBounds.height + deltaY;
  const width = Math.max(rawWidth, minimumSize.width);
  const height = Math.max(rawHeight, minimumSize.height);

  return {
    width,
    height,
    x: growsLeft ? startBounds.x + startBounds.width - width : startBounds.x,
    y: growsUp ? startBounds.y + startBounds.height - height : startBounds.y,
  };
}

function updateNodeBounds(
  state: CanvasState,
  nodeId: string,
  bounds: Partial<NodeBounds>,
): CanvasState {
  return {
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...bounds } : node,
    ),
  };
}
