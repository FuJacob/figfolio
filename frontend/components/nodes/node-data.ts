import type { NodeKind, PortfolioNode } from "./types";

export const MIN_NODE_SIZE = {
  text: { width: 180, height: 96 },
  image: { width: 240, height: 220 },
} satisfies Record<NodeKind, { width: number; height: number }>;

export const INITIAL_NODES: PortfolioNode[] = [
  {
    id: "hero-name",
    kind: "text",
    text: "asdasd",
    x: 56,
    y: 56,
    width: 500,
    height: 190,
  },
  {
    id: "figma-image",
    kind: "image",
    title: "Figma-style image node",
    alt: "Pixelated Figma-style mark inside a framed image node",
    x: 690,
    y: 72,
    width: 360,
    height: 326,
  },
];
