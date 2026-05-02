import type { NodeKind, PortfolioNode } from "./types";

export const MIN_NODE_SIZE = {
  text: { width: 180, height: 96 },
  image: { width: 240, height: 220 },
} satisfies Record<NodeKind, { width: number; height: number }>;

export const INITIAL_NODES: PortfolioNode[] = [
  {
    id: "hero-name",
    kind: "text",
    text: "jacob fu",
    x: 20,
    y: 44,
    width: 288,
    height: 118,
  },
  {
    id: "figma-image",
    kind: "image",
    title: "Figma-style image node",
    alt: "Pixelated Figma-style mark inside a framed image node",
    x: 36,
    y: 188,
    width: 264,
    height: 246,
  },
];
