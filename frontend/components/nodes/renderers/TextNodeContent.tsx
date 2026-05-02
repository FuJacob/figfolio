import type { TextNode } from "../types";

type TextNodeContentProps = {
  node: TextNode;
};

/**
 * TextNodeContent renders only text visuals.
 * Selection and resizing stay in NodeFrame so this component remains reusable.
 */
export function TextNodeContent({ node }: TextNodeContentProps) {
  const fontSize = getFontSizeForTextNode(node);

  return (
    <div
      aria-label="Text node"
      className="flex h-full w-full items-center overflow-hidden whitespace-nowrap px-3 font-bold leading-[0.9] tracking-normal text-node-text"
      style={{ fontSize }}
    >
      {node.text}
    </div>
  );
}

/**
 * Estimates a single-line font size from both dimensions.
 *
 * Height alone can produce clipped text on narrow mobile nodes, so the width
 * participates in the calculation before the value is applied inline.
 */
function getFontSizeForTextNode(node: TextNode): number {
  const horizontalPadding = 24;
  const averageGlyphWidth = 0.58;
  const availableWidth = Math.max(1, node.width - horizontalPadding);
  const widthLimitedSize =
    availableWidth / Math.max(1, node.text.length * averageGlyphWidth);
  const heightLimitedSize = node.height * 0.68;

  return Math.max(32, Math.round(Math.min(heightLimitedSize, widthLimitedSize)));
}
