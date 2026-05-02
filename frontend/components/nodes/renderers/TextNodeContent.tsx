import type { TextNode } from "../types";

type TextNodeContentProps = {
  node: TextNode;
};

/**
 * TextNodeContent renders only text visuals.
 * Selection and resizing stay in NodeFrame so this component remains reusable.
 */
export function TextNodeContent({ node }: TextNodeContentProps) {
  return (
    <div
      aria-label="Text node"
      className="flex h-full w-full items-center overflow-hidden whitespace-nowrap px-3 text-[clamp(4.5rem,10.5vw,8.2rem)] font-bold leading-[0.9] tracking-normal text-[#242424] [font-family:Arial,Helvetica,sans-serif]"
    >
      {node.text}
    </div>
  );
}
