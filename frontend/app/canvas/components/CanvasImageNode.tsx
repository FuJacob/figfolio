import Image from "next/image";
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
      <div className="relative h-full w-full overflow-hidden rounded-sm">
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
      </div>
    </CanvasNodeFrame>
  );
}
