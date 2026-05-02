import { PointerEvent, ReactNode } from "react";

import type { PortfolioNode, ResizeHandle } from "./types";

const resizeHandles: ResizeHandle[] = [
  "northWest",
  "northEast",
  "southWest",
  "southEast",
];

const handlePositionClass: Record<ResizeHandle, string> = {
  northWest: "-left-3.5 -top-3.5 cursor-nwse-resize",
  northEast: "-right-3.5 -top-3.5 cursor-nesw-resize",
  southWest: "-bottom-3.5 -left-3.5 cursor-nesw-resize",
  southEast: "-bottom-3.5 -right-3.5 cursor-nwse-resize",
};

type NodeFrameProps = {
  node: PortfolioNode;
  isInteracting: boolean;
  isSelected: boolean;
  children: ReactNode;
  onNodePointerDown: (
    event: PointerEvent<HTMLElement>,
    node: PortfolioNode,
  ) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onResizePointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    node: PortfolioNode,
    handle: ResizeHandle,
  ) => void;
};

/**
 * NodeFrame centralizes editor chrome: selection, handles, dragging, and sizing.
 * Node-specific components should render content only, not interaction logic.
 */
export function NodeFrame({
  node,
  isInteracting,
  isSelected,
  children,
  onNodePointerDown,
  onPointerCancel,
  onPointerMove,
  onPointerUp,
  onResizePointerDown,
}: NodeFrameProps) {
  return (
    <article
      className={`absolute left-0 top-0 touch-none select-none will-change-transform ${
        isInteracting ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        width: node.width,
        height: node.height,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
      onPointerCancel={onPointerCancel}
      onPointerDown={(event) => onNodePointerDown(event, node)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}

      {isSelected ? (
        <>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-20 border-4 border-[#0d99ff] ${
              node.kind === "image" ? "rounded-[32px]" : ""
            }`}
          />

          {resizeHandles.map((handle) => (
            <button
              key={handle}
              aria-label={`Resize ${node.kind} node`}
              className={`absolute z-30 h-7 w-7 rounded-[7px] border-4 border-[#0d99ff] bg-background p-0 outline-none transition-transform focus-visible:ring-4 focus-visible:ring-[#0d99ff]/25 ${handlePositionClass[handle]}`}
              type="button"
              onPointerDown={(event) =>
                onResizePointerDown(event, node, handle)
              }
            />
          ))}
        </>
      ) : null}
    </article>
  );
}
