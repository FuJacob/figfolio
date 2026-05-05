import { create } from "zustand";
import {
  getScaledFontSize,
  getTextNodeSize,
  getWrappedTextNodeSize,
  snapSize,
  snapToGrid,
} from "./geometry";
import { cloneLayout, LAYOUT_PRESET } from "./layoutPresets";
import type {
  Bounds,
  CanvasLayout,
  CanvasNodeId,
  CanvasPoint,
} from "./types";

type CanvasState = {
  clearSelection: () => void;
  layout: CanvasLayout;
  moveNode: (id: CanvasNodeId, position: CanvasPoint) => void;
  resetLayout: () => void;
  resizeNode: (id: CanvasNodeId, bounds: Bounds) => void;
  selectedNodeId: CanvasNodeId | null;
  selectNode: (id: CanvasNodeId) => void;
  syncTextNodeSize: (id: CanvasNodeId, size: Pick<Bounds, "height" | "width">) => void;
};

function getInitialLayout(): CanvasLayout {
  return cloneLayout(LAYOUT_PRESET);
}

export const useCanvasStore = create<CanvasState>((set) => ({
  layout: getInitialLayout(),
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
      const layout = state.layout;
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
        layout: {
          ...layout,
          nodes: {
            ...layout.nodes,
            [id]: {
              ...node,
              x: nextX,
              y: nextY,
            },
          },
        },
      };
    }),
  resetLayout: () =>
    set(() => {
      const nextLayout = getInitialLayout();

      return {
        layout: nextLayout,
        selectedNodeId: null,
      };
    }),
  resizeNode: (id, bounds) =>
    set((state) => {
      const layout = state.layout;
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
        const nextSize =
          node.sizingMode === "hug"
            ? getTextNodeSize({
                fontSize: nextFontSize,
                fontWeight: node.fontWeight,
                paddingX: node.paddingX,
                paddingY: node.paddingY,
                value: node.value,
              })
            : node.sizingMode === "wrap"
              ? getWrappedTextNodeSize({
                  width: nextWidth,
                  fontSize: nextFontSize,
                  fontWeight: node.fontWeight,
                  paddingX: node.paddingX,
                  paddingY: node.paddingY,
                  value: node.value,
                })
            : {
                width: nextWidth,
                height: nextHeight,
              };

        if (
          node.x === nextX &&
          node.y === nextY &&
          node.width === nextSize.width &&
          node.height === nextSize.height &&
          node.fontSize === nextFontSize
        ) {
          return state;
        }

        return {
          layout: {
            ...layout,
            nodes: {
              ...layout.nodes,
              [id]: {
                ...node,
                x: nextX,
                y: nextY,
                width: nextSize.width,
                height: nextSize.height,
                fontSize: nextFontSize,
              },
            },
          },
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
        layout: {
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
        },
      };
    }),
  syncTextNodeSize: (id, size) =>
    set((state) => {
      const layout = state.layout;
      const node = layout.nodes[id];

      if (!node || node.type !== "text" || node.sizingMode === "fixed") {
        return state;
      }

      const nextWidth =
        node.sizingMode === "hug" ? Math.ceil(size.width) : node.width;
      const nextHeight = Math.ceil(size.height);

      if (node.width === nextWidth && node.height === nextHeight) {
        return state;
      }

      return {
        layout: {
          ...layout,
          nodes: {
            ...layout.nodes,
            [id]: {
              ...node,
              width: nextWidth,
              height: nextHeight,
              baseWidth: nextWidth,
              baseHeight: nextHeight,
              baseFontSize: node.fontSize,
            },
          },
        },
      };
    }),
  selectNode: (id) =>
    set((state) => {
      if (!state.layout.nodes[id] || state.selectedNodeId === id) {
        return state;
      }

      return { selectedNodeId: id };
    }),
}));
