import { create } from "zustand";
import { getScaledFontSize, snapSize, snapToGrid } from "./geometry";
import { cloneLayout, LAYOUT_PRESETS } from "./layoutPresets";
import type {
  Bounds,
  CanvasLayout,
  CanvasLayouts,
  CanvasNodeId,
  CanvasPoint,
  LayoutMode,
} from "./types";

type CanvasState = {
  activeLayout: LayoutMode;
  clearSelection: () => void;
  layouts: CanvasLayouts;
  moveNode: (id: CanvasNodeId, position: CanvasPoint) => void;
  resizeNode: (id: CanvasNodeId, bounds: Bounds) => void;
  selectedNodeId: CanvasNodeId | null;
  setActiveLayout: (mode: LayoutMode) => void;
  selectNode: (id: CanvasNodeId) => void;
};

const INITIAL_LAYOUTS: CanvasLayouts = {
  desktop: cloneLayout(LAYOUT_PRESETS.desktop),
  mobile: cloneLayout(LAYOUT_PRESETS.mobile),
};

export const useCanvasStore = create<CanvasState>((set) => ({
  activeLayout: "desktop",
  layouts: INITIAL_LAYOUTS,
  selectedNodeId: null,
  clearSelection: () =>
    set((state) => {
      if (!state.selectedNodeId) {
        return state;
      }

      return { selectedNodeId: null };
    }),
  setActiveLayout: (mode) =>
    set((state) => {
      if (state.activeLayout === mode) {
        return state;
      }

      return {
        activeLayout: mode,
        selectedNodeId: null,
      };
    }),
  moveNode: (id, position) =>
    set((state) => {
      const layout = getActiveLayout(state);
      const node = layout.nodes[id];

      if (!node) {
        return state;
      }

      const nextX = snapToGrid(position.x);
      const nextY = snapToGrid(position.y);

      if (node.x === nextX && node.y === nextY) {
        return state;
      }

      return {
        layouts: updateActiveLayout(state, {
          ...layout,
          nodes: {
            ...layout.nodes,
            [id]: {
              ...node,
              x: nextX,
              y: nextY,
            },
          },
        }),
      };
    }),
  resizeNode: (id, bounds) =>
    set((state) => {
      const layout = getActiveLayout(state);
      const node = layout.nodes[id];

      if (!node) {
        return state;
      }

      const nextWidth = snapSize(bounds.width);
      const nextHeight = snapSize(bounds.height);
      const nextX = snapToGrid(bounds.x);
      const nextY = snapToGrid(bounds.y);

      if (node.type === "text") {
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
          layouts: updateActiveLayout(state, {
            ...layout,
            nodes: {
              ...layout.nodes,
              [id]: {
                ...node,
                x: nextX,
                y: nextY,
                width: nextWidth,
                height: nextHeight,
                fontSize: nextFontSize,
              },
            },
          }),
        };
      }

      if (
        node.x === nextX &&
        node.y === nextY &&
        node.width === nextWidth &&
        node.height === nextHeight
      ) {
        return state;
      }

      return {
        layouts: updateActiveLayout(state, {
          ...layout,
          nodes: {
            ...layout.nodes,
            [id]: {
              ...node,
              x: nextX,
              y: nextY,
              width: nextWidth,
              height: nextHeight,
            },
          },
        }),
      };
    }),
  selectNode: (id) =>
    set((state) => {
      if (!getActiveLayout(state).nodes[id] || state.selectedNodeId === id) {
        return state;
      }

      return { selectedNodeId: id };
    }),
}));

function getActiveLayout(state: Pick<CanvasState, "activeLayout" | "layouts">) {
  return state.layouts[state.activeLayout];
}

function updateActiveLayout(
  state: Pick<CanvasState, "activeLayout" | "layouts">,
  layout: CanvasLayout,
): CanvasLayouts {
  return {
    ...state.layouts,
    [state.activeLayout]: layout,
  };
}
