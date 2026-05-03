import Image from "next/image";
import {
  IMAGE_NODE_CONTENT_RADIUS,
  IMAGE_NODE_FRAME_PADDING,
  IMAGE_NODE_FRAME_RADIUS,
} from "../constants";
import type { ImageCanvasNode } from "../types";
import { cx } from "../utils/classNames";
import { CanvasNodeFrame } from "./CanvasNodeFrame";

type CanvasImageNodeViewProps = {
  isSelected: boolean;
  node: ImageCanvasNode;
};

/**
 * Renders bitmap assets inside the shared canvas node shell. The node decides
 * whether the image should preserve the full source (`contain`) or fill the
 * box and crop overflow (`cover`).
 */
export function CanvasImageNodeView({
  isSelected,
  node,
}: CanvasImageNodeViewProps) {
  return (
    <CanvasNodeFrame
      isSelected={isSelected}
      node={node}
      title={`${node.alt} (${node.x}, ${node.y})`}
    >
      <div
        aria-hidden="true"
        className="absolute border border-slate-300 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.12)]"
        style={{
          inset: -IMAGE_NODE_FRAME_PADDING,
          borderRadius: IMAGE_NODE_FRAME_RADIUS,
        }}
      />
      <div
        className="relative h-full w-full overflow-hidden bg-slate-900"
        style={{ borderRadius: IMAGE_NODE_CONTENT_RADIUS }}
      >
        <NodeImageContent node={node} />
      </div>
      {isSelected ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-900">
          <NodeImageContent node={node} />
        </div>
      ) : null}
    </CanvasNodeFrame>
  );
}

function NodeImageContent({ node }: { node: ImageCanvasNode }) {
  return (
    <Image
      alt={node.alt}
      className={cx(
        "pointer-events-none select-none",
        node.fit === "cover" ? "object-cover" : "object-contain",
      )}
      draggable={false}
      fill
      sizes={`${node.width}px`}
      src={node.src}
    />
  );
}
