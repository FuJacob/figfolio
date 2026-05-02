import Image from "next/image";

import type { ImageNode } from "../types";

type ImageNodeContentProps = {
  node: ImageNode;
};

/**
 * ImageNodeContent owns the framed image treatment.
 * The optional src makes the same node foundation work for real portfolio
 * images while the fallback preview mirrors the provided Figma-style reference.
 */
export function ImageNodeContent({ node }: ImageNodeContentProps) {
  return (
    <figure
      aria-label={node.title}
      className="m-0 h-full w-full rounded-[32px] border-[3px] border-image-frame-border bg-image-frame-surface p-8 shadow-[var(--image-frame-shadow)]"
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-image-frame-mat">
        {node.src ? (
          <Image
            fill
            priority
            alt={node.alt}
            className="object-contain p-12"
            draggable={false}
            sizes="360px"
            src={node.src}
          />
        ) : (
          <FigmaMarkPreview />
        )}
      </div>
    </figure>
  );
}

function FigmaMarkPreview() {
  const shapeClass = "absolute block h-[28%] w-1/2";

  return (
    <div
      aria-hidden="true"
      className="absolute left-[7%] top-[6%] aspect-[1/1.45] w-[min(68%,230px)] [filter:var(--figma-mark-shadow)]"
    >
      <span
        className={`${shapeClass} left-0 top-0 rounded-l-[18px] bg-figma-red shadow-[var(--figma-shape-shadow)]`}
      />
      <span
        className={`${shapeClass} left-1/2 top-0 rounded-r-[18px] bg-figma-coral shadow-[var(--figma-shape-shadow)]`}
      />
      <span
        className={`${shapeClass} left-0 top-[28%] rounded-l-[18px] bg-figma-purple shadow-[var(--figma-shape-shadow)]`}
      />
      <span
        className={`${shapeClass} left-1/2 top-[28%] rounded-full bg-figma-blue shadow-[var(--figma-shape-shadow)]`}
      />
      <span
        className={`${shapeClass} left-0 top-[56%] rounded-b-full rounded-t-[18px] bg-figma-green shadow-[var(--figma-shape-shadow)]`}
      />
    </div>
  );
}
