import type {
  CanvasLayout,
  CanvasNode,
  CanvasNodeId,
  ImageCanvasNode,
  TextCanvasNode,
} from "./types";

type WorkExperience = {
  alt: string;
  id: string;
  label: string;
  src: string;
  year: string;
};

const HERO_PLACEHOLDER_SRC = "/companies/kaimz.png";

const WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: "ramp",
    label: "Ramp",
    year: "2025",
    src: "/companies/ramp.jpeg",
    alt: "Ramp logo",
  },
  {
    id: "uber",
    label: "Uber",
    year: "YYYY",
    src: "/companies/uber.png",
    alt: "Uber logo",
  },
  {
    id: "hubspot",
    label: "HubSpot",
    year: "YYYY",
    src: "/companies/hubspot.png",
    alt: "HubSpot logo",
  },
  {
    id: "bridgewell",
    label: "Bridgewell",
    year: "YYYY",
    src: "/companies/bridgewell.png",
    alt: "Bridgewell logo",
  },
  {
    id: "kaimz",
    label: "Kaimz",
    year: "YYYY",
    src: "/companies/kaimz.png",
    alt: "Kaimz logo",
  },
];

const DESKTOP_NODES: CanvasNode[] = [
  createTextNode({
    id: "greeting",
    x: 100,
    y: 60,
    width: 180,
    height: 40,
    fontSize: 30,
    value: "hey there!",
  }),
  createTextNode({
    id: "intro",
    x: 100,
    y: 110,
    width: 420,
    height: 170,
    fontSize: 76,
    value: "i'm\nJacob Fu",
  }),
  createImageNode({
    id: "hero-placeholder",
    alt: "Hero placeholder image",
    src: HERO_PLACEHOLDER_SRC,
    x: 760,
    y: 100,
    width: 220,
    height: 260,
    fit: "cover",
  }),
  createTextNode({
    id: "study-heading",
    x: 100,
    y: 360,
    width: 160,
    height: 40,
    fontSize: 30,
    value: "I study",
  }),
  createImageNode({
    id: "study-waterloo-image",
    alt: "University of Waterloo logo",
    src: "/companies/waterloo.png",
    x: 100,
    y: 420,
    width: 100,
    height: 100,
    fit: "contain",
  }),
  createTextNode({
    id: "study-waterloo-name",
    x: 240,
    y: 428,
    width: 360,
    height: 40,
    fontSize: 28,
    value: "University of Waterloo",
  }),
  createTextNode({
    id: "study-waterloo-program",
    x: 240,
    y: 472,
    width: 280,
    height: 34,
    fontSize: 24,
    value: "Computer Science",
  }),
  createTextNode({
    id: "work-heading",
    x: 100,
    y: 580,
    width: 240,
    height: 40,
    fontSize: 30,
    value: "I work(ed) at",
  }),
  ...createDesktopWorkNodes(),
  createTextNode({
    id: "built-heading",
    x: 740,
    y: 420,
    width: 260,
    height: 70,
    fontSize: 30,
    value: "one day /\ni've built",
  }),
  createImageNode({
    id: "project-one",
    alt: "Project placeholder one",
    src: "/companies/bridgewell.png",
    x: 700,
    y: 520,
    width: 120,
    height: 140,
    fit: "cover",
  }),
  createImageNode({
    id: "project-two",
    alt: "Project placeholder two",
    src: "/companies/hubspot.png",
    x: 850,
    y: 485,
    width: 150,
    height: 180,
    fit: "cover",
  }),
  createImageNode({
    id: "project-three",
    alt: "Project placeholder three",
    src: "/companies/uber.png",
    x: 1030,
    y: 525,
    width: 120,
    height: 140,
    fit: "cover",
  }),
];

const MOBILE_NODES: CanvasNode[] = [
  createTextNode({
    id: "greeting",
    x: 20,
    y: 24,
    width: 140,
    height: 32,
    fontSize: 24,
    value: "hey there!",
  }),
  createTextNode({
    id: "intro",
    x: 20,
    y: 64,
    width: 180,
    height: 120,
    fontSize: 52,
    value: "i'm\nJacob Fu",
  }),
  createImageNode({
    id: "hero-placeholder",
    alt: "Hero placeholder image",
    src: HERO_PLACEHOLDER_SRC,
    x: 220,
    y: 56,
    width: 88,
    height: 112,
    fit: "cover",
  }),
  createTextNode({
    id: "study-heading",
    x: 20,
    y: 198,
    width: 120,
    height: 28,
    fontSize: 24,
    value: "I study",
  }),
  createImageNode({
    id: "study-waterloo-image",
    alt: "University of Waterloo logo",
    src: "/companies/waterloo.png",
    x: 20,
    y: 238,
    width: 72,
    height: 72,
    fit: "contain",
  }),
  createTextNode({
    id: "study-waterloo-name",
    x: 116,
    y: 242,
    width: 190,
    height: 48,
    fontSize: 18,
    value: "University of\nWaterloo",
  }),
  createTextNode({
    id: "study-waterloo-program",
    x: 116,
    y: 294,
    width: 180,
    height: 24,
    fontSize: 18,
    value: "Computer Science",
  }),
  createTextNode({
    id: "work-heading",
    x: 20,
    y: 348,
    width: 180,
    height: 28,
    fontSize: 24,
    value: "I work(ed) at",
  }),
  ...createMobileWorkNodes(),
  createTextNode({
    id: "built-heading",
    x: 20,
    y: 690,
    width: 220,
    height: 56,
    fontSize: 24,
    value: "one day /\ni've built",
  }),
  createImageNode({
    id: "project-one",
    alt: "Project placeholder one",
    src: "/companies/bridgewell.png",
    x: 20,
    y: 754,
    width: 68,
    height: 80,
    fit: "cover",
  }),
  createImageNode({
    id: "project-two",
    alt: "Project placeholder two",
    src: "/companies/hubspot.png",
    x: 118,
    y: 740,
    width: 84,
    height: 96,
    fit: "cover",
  }),
  createImageNode({
    id: "project-three",
    alt: "Project placeholder three",
    src: "/companies/uber.png",
    x: 228,
    y: 754,
    width: 68,
    height: 80,
    fit: "cover",
  }),
];

function createDesktopWorkNodes(): CanvasNode[] {
  return [
    ...createWorkRowNodes({
      companyX: 200,
      imageX: 100,
      labelFontSize: 24,
      labelWidth: 160,
      rowY: 640,
      size: 64,
      work: WORK_EXPERIENCES[0],
      yearX: 380,
    }),
    ...createWorkRowNodes({
      companyX: 520,
      imageX: 420,
      labelFontSize: 24,
      labelWidth: 160,
      rowY: 640,
      size: 64,
      work: WORK_EXPERIENCES[1],
      yearX: 700,
    }),
    ...createWorkRowNodes({
      companyX: 200,
      imageX: 100,
      labelFontSize: 24,
      labelWidth: 180,
      rowY: 730,
      size: 64,
      work: WORK_EXPERIENCES[2],
      yearX: 380,
    }),
    ...createWorkRowNodes({
      companyX: 520,
      imageX: 420,
      labelFontSize: 24,
      labelWidth: 180,
      rowY: 730,
      size: 64,
      work: WORK_EXPERIENCES[3],
      yearX: 700,
    }),
    ...createWorkRowNodes({
      companyX: 200,
      imageX: 100,
      labelFontSize: 24,
      labelWidth: 160,
      rowY: 820,
      size: 64,
      work: WORK_EXPERIENCES[4],
      yearX: 380,
    }),
  ];
}

function createMobileWorkNodes(): CanvasNode[] {
  return WORK_EXPERIENCES.flatMap((work, index) =>
    createWorkRowNodes({
      companyX: 92,
      imageX: 20,
      labelFontSize: 18,
      labelWidth: 120,
      rowY: 396 + index * 58,
      size: 44,
      work,
      yearX: 236,
    }),
  );
}

function createWorkRowNodes({
  companyX,
  imageX,
  labelFontSize,
  labelWidth,
  rowY,
  size,
  work,
  yearX,
}: {
  companyX: number;
  imageX: number;
  labelFontSize: number;
  labelWidth: number;
  rowY: number;
  size: number;
  work: WorkExperience;
  yearX: number;
}): CanvasNode[] {
  return [
    createImageNode({
      id: `work-${work.id}-image`,
      alt: work.alt,
      src: work.src,
      x: imageX,
      y: rowY,
      width: size,
      height: size,
      fit: "contain",
    }),
    createTextNode({
      id: `work-${work.id}-label`,
      x: companyX,
      y: rowY + 6,
      width: labelWidth,
      height: 28,
      fontSize: labelFontSize,
      value: work.label,
    }),
    createTextNode({
      id: `work-${work.id}-year`,
      x: yearX,
      y: rowY + 8,
      width: 80,
      height: 24,
      fontSize: Math.max(labelFontSize - 4, 14),
      value: work.year,
    }),
  ];
}

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
  input: Omit<
    TextCanvasNode,
    "baseFontSize" | "baseHeight" | "baseWidth" | "type"
  >,
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
