import { create } from "zustand";
import { getScaledFontSize, snapSize, snapToGrid } from "./geometry";
import type { Bounds, CanvasNode, CanvasNodeId, CanvasPoint } from "./types";

type CanvasState = {
  clearSelection: () => void;
  moveNode: (id: CanvasNodeId, position: CanvasPoint) => void;
  nodeIds: CanvasNodeId[];
  nodes: Record<CanvasNodeId, CanvasNode>;
  resizeNode: (id: CanvasNodeId, bounds: Bounds) => void;
  selectedNodeId: CanvasNodeId | null;
  selectNode: (id: CanvasNodeId) => void;
};

const INITIAL_NODES: Record<CanvasNodeId, CanvasNode> = {
  headline: {
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
  subtitle: {
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
  note: {
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
};

export const useCanvasStore = create<CanvasState>((set) => ({
  nodeIds: Object.keys(INITIAL_NODES),
  nodes: INITIAL_NODES,
  selectedNodeId: null,
  clearSelection: () =>
    set((state) => {
      if (!state.selectedNodeId) {
        return state;
      }

      return { selectedNodeId: null };
    }),
  moveNode: (id, position) =>
    set((state) => {
      const node = state.nodes[id];

      if (!node) {
        return state;
      }

      const nextX = snapToGrid(position.x);
      const nextY = snapToGrid(position.y);

      if (node.x === nextX && node.y === nextY) {
        return state;
      }

      return {
        nodes: {
          ...state.nodes,
          [id]: {
            ...node,
            x: nextX,
            y: nextY,
          },
        },
      };
    }),
  resizeNode: (id, bounds) =>
    set((state) => {
      const node = state.nodes[id];

      if (!node) {
        return state;
      }

      const nextWidth = snapSize(bounds.width);
      const nextHeight = snapSize(bounds.height);
      const nextX = snapToGrid(bounds.x);
      const nextY = snapToGrid(bounds.y);
      const nextFontSize = getScaledFontSize(node, {
        width: nextWidth,
        height: nextHeight,
      });

      if (
        node.x === nextX &&
        node.y === nextY &&
        node.width === nextWidth &&
        node.height === nextHeight &&
        node.fontSize === nextFontSize
      ) {
        return state;
      }

      return {
        nodes: {
          ...state.nodes,
          [id]: {
            ...node,
            x: nextX,
            y: nextY,
            width: nextWidth,
            height: nextHeight,
            fontSize: nextFontSize,
          },
        },
      };
    }),
  selectNode: (id) =>
    set((state) => {
      if (!state.nodes[id] || state.selectedNodeId === id) {
        return state;
      }

      return { selectedNodeId: id };
    }),
}));
