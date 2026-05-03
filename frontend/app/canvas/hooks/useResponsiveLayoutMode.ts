import { useSyncExternalStore } from "react";
import { DESKTOP_LAYOUT_MIN_WIDTH } from "../constants";
import type { LayoutMode } from "../types";

const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_LAYOUT_MIN_WIDTH}px)`;

/**
 * Resolves the active layout preset from the viewport width while remaining
 * safe during server rendering.
 */
export function useResponsiveLayoutMode(): LayoutMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onStoreChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY);

  mediaQueryList.addEventListener("change", onStoreChange);

  return () => {
    mediaQueryList.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): LayoutMode {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches ? "desktop" : "mobile";
}

function getServerSnapshot(): LayoutMode {
  return "desktop";
}
