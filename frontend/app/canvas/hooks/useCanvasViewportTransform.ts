import { useSyncExternalStore } from "react";
import { getCanvasViewportTransform } from "../viewportTransform";
import type { CanvasFrame, CanvasViewportTransform, Size } from "../types";

const SERVER_VIEWPORT_SIZE: Size = {
  width: 1440,
  height: 900,
};
let cachedViewportSize: Size | null = null;

/**
 * Tracks the viewport size and derives the active artboard transform from it.
 */
export function useCanvasViewportTransform(
  frame: CanvasFrame,
): CanvasViewportTransform {
  const viewport = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return getCanvasViewportTransform({ frame, viewport });
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
  };
}

function getSnapshot(): Size {
  const nextWidth = window.innerWidth;
  const nextHeight = window.innerHeight;

  if (
    cachedViewportSize &&
    cachedViewportSize.width === nextWidth &&
    cachedViewportSize.height === nextHeight
  ) {
    return cachedViewportSize;
  }

  cachedViewportSize = {
    width: nextWidth,
    height: nextHeight,
  };

  return cachedViewportSize;
}

function getServerSnapshot(): Size {
  return SERVER_VIEWPORT_SIZE;
}
