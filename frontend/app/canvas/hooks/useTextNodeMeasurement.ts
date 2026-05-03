import { useLayoutEffect, useRef } from "react";
import { useCanvasStore } from "../store";
import type { TextCanvasNode } from "../types";

/**
 * Synchronizes wrap and hug text nodes with the size their DOM content actually
 * renders at so selection bounds follow real typography instead of estimates.
 */
export function useTextNodeMeasurement(node: TextCanvasNode) {
  const elementRef = useRef<HTMLDivElement>(null);
  const syncTextNodeSize = useCanvasStore((state) => state.syncTextNodeSize);

  useLayoutEffect(() => {
    if (node.sizingMode === "fixed") {
      return;
    }

    const element = elementRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      syncTextNodeSize(node.id, {
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    node.fontSize,
    node.fontWeight,
    node.id,
    node.paddingX,
    node.paddingY,
    node.sizingMode,
    node.value,
    node.width,
    syncTextNodeSize,
  ]);

  return elementRef;
}
