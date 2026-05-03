import type {
  CanvasLayout,
  CanvasNode,
  CanvasNodeId,
  ImageCanvasNode,
  TextCanvasNode,
} from "./types";

const DESKTOP_NODES: CanvasNode[] = [
  createTextNode({
    id: "headline",
    x: 80,
    y: 80,
    width: 320,
    height: 60,
    fontSize: 28,
    value: "Design systems for fast teams",
  }),
  createTextNode({
    id: "subtitle",
    x: 80,
    y: 160,
    width: 360,
    height: 80,
    fontSize: 18,
    value: "Ship clean interfaces with reusable components.",
  }),
  createImageNode({
    id: "bridgewell",
    alt: "Bridgewell logo",
    src: "/companies/bridgewell.png",
    x: 520,
    y: 80,
    width: 120,
    height: 120,
  }),
  createImageNode({
    id: "hubspot",
    alt: "HubSpot logo",
    src: "/companies/hubspot.png",
    x: 660,
    y: 80,
    width: 120,
    height: 120,
  }),
  createImageNode({
    id: "kaimz",
    alt: "Kaimz logo",
    src: "/companies/kaimz.png",
    x: 800,
    y: 100,
    width: 160,
    height: 120,
  }),
  createImageNode({
    id: "ramp",
    alt: "Ramp logo",
    src: "/companies/ramp.jpeg",
    x: 520,
    y: 240,
    width: 120,
    height: 120,
  }),
  createImageNode({
    id: "uber",
    alt: "Uber logo",
    src: "/companies/uber.png",
    x: 680,
    y: 260,
    width: 120,
    height: 120,
  }),
  createImageNode({
    id: "waterloo",
    alt: "University of Waterloo logo",
    src: "/companies/waterloo.png",
    x: 840,
    y: 260,
    width: 120,
    height: 120,
  }),
];

const MOBILE_NODES: CanvasNode[] = [
  createTextNode({
    id: "headline",
    x: 20,
    y: 80,
    width: 280,
    height: 80,
    fontSize: 26,
    value: "Design systems for fast teams",
  }),
  createTextNode({
    id: "subtitle",
    x: 20,
    y: 180,
    width: 280,
    height: 100,
    fontSize: 18,
    value: "Ship clean interfaces with reusable components.",
  }),
  createImageNode({
    id: "bridgewell",
    alt: "Bridgewell logo",
    src: "/companies/bridgewell.png",
    x: 20,
    y: 320,
    width: 100,
    height: 100,
  }),
  createImageNode({
    id: "hubspot",
    alt: "HubSpot logo",
    src: "/companies/hubspot.png",
    x: 160,
    y: 320,
    width: 100,
    height: 100,
  }),
  createImageNode({
    id: "kaimz",
    alt: "Kaimz logo",
    src: "/companies/kaimz.png",
    x: 20,
    y: 440,
    width: 120,
    height: 100,
  }),
  createImageNode({
    id: "ramp",
    alt: "Ramp logo",
    src: "/companies/ramp.jpeg",
    x: 160,
    y: 440,
    width: 100,
    height: 100,
  }),
  createImageNode({
    id: "uber",
    alt: "Uber logo",
    src: "/companies/uber.png",
    x: 20,
    y: 560,
    width: 100,
    height: 100,
  }),
  createImageNode({
    id: "waterloo",
    alt: "University of Waterloo logo",
    src: "/companies/waterloo.png",
    x: 160,
    y: 560,
    width: 100,
    height: 100,
  }),
];

/**
 * Builds a layout from authored nodes while preserving the intended render
 * order separately from the node record.
 */
function createLayout(nodes: CanvasNode[]): CanvasLayout {
  return {
    nodeIds: nodes.map((node) => node.id),
    nodes: Object.fromEntries(
      nodes.map((node) => [node.id, cloneNode(node)]),
    ) as Record<CanvasNodeId, CanvasNode>,
  };
}

function createTextNode(
  input: Omit<TextCanvasNode, "baseFontSize" | "baseHeight" | "baseWidth" | "type">,
): TextCanvasNode {
  return {
    ...input,
    type: "text",
    baseWidth: input.width,
    baseHeight: input.height,
    baseFontSize: input.fontSize,
  };
}

function createImageNode(
  input: Omit<ImageCanvasNode, "baseHeight" | "baseWidth" | "fit" | "type"> & {
    fit?: ImageCanvasNode["fit"];
  },
): ImageCanvasNode {
  return {
    ...input,
    type: "image",
    baseWidth: input.width,
    baseHeight: input.height,
    fit: input.fit ?? "cover",
  };
}

/**
 * Clones a layout preset so editing session state cannot mutate the authored
 * preset objects by reference.
 */
export function cloneLayout(layout: CanvasLayout): CanvasLayout {
  return {
    nodeIds: [...layout.nodeIds],
    nodes: Object.fromEntries(
      Object.entries(layout.nodes).map(([id, node]) => [id, cloneNode(node)]),
    ) as Record<CanvasNodeId, CanvasNode>,
  };
}

function cloneNode(node: CanvasNode): CanvasNode {
  return { ...node };
}

export const LAYOUT_PRESETS = {
  desktop: createLayout(DESKTOP_NODES),
  mobile: createLayout(MOBILE_NODES),
} as const;
