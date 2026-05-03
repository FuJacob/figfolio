import { RESIZE_HANDLES } from "../constants";
import { useResizeInteraction } from "../hooks/useResizeInteraction";
import { getSelectionBounds } from "../selection";
import type { CanvasNode } from "../types";
import { ResizeHandleButton } from "./ResizeHandle";

type SelectionOverlayProps = {
  node: CanvasNode;
};

/**
 * Renders one canonical selection box and resize-handle set for whichever
 * node is currently selected.
 */
export function SelectionOverlay({ node }: SelectionOverlayProps) {
  const bounds = getSelectionBounds(node);
  const interaction = useResizeInteraction(node);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      style={{
        transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        width: bounds.width,
        height: bounds.height,
      }}
    >
      <div className="absolute inset-0 border-[3px] border-sky-500" />
      {RESIZE_HANDLES.map((handle) => (
        <ResizeHandleButton
          key={handle}
          handle={handle}
          onPointerDown={interaction.handleResizePointerDown}
          onPointerMove={interaction.handleResizePointerMove}
          onPointerUp={interaction.handleResizePointerUp}
        />
      ))}
    </div>
  );
}
