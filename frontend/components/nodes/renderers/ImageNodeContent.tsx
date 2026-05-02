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
      className="m-0 h-full w-full rounded-[32px] border-[3px] border-[#bdbdbd] bg-[#fafafa] p-[clamp(18px,6%,30px)] shadow-[0_24px_44px_-26px_rgba(30,30,30,0.45)]"
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#282828]">
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
      className="absolute left-[7%] top-[6%] aspect-[1/1.45] w-[min(68%,230px)] [filter:drop-shadow(-10px_14px_0_rgba(0,0,0,0.28))]"
    >
      <span
        className={`${shapeClass} left-0 top-0 rounded-l-[18px] bg-[#f24e2e] shadow-[inset_-8px_0_0_rgba(0,0,0,0.18)]`}
      />
      <span
        className={`${shapeClass} left-1/2 top-0 rounded-r-[18px] bg-[#ff6258] shadow-[inset_-8px_0_0_rgba(0,0,0,0.18)]`}
      />
      <span
        className={`${shapeClass} left-0 top-[28%] rounded-l-[18px] bg-[#994ff3] shadow-[inset_-8px_0_0_rgba(0,0,0,0.18)]`}
      />
      <span
        className={`${shapeClass} left-1/2 top-[28%] rounded-full bg-[#28aeea] shadow-[inset_-8px_0_0_rgba(0,0,0,0.18)]`}
      />
      <span
        className={`${shapeClass} left-0 top-[56%] rounded-b-full rounded-t-[18px] bg-[#2bcf83] shadow-[inset_-8px_0_0_rgba(0,0,0,0.18)]`}
      />
    </div>
  );
}
