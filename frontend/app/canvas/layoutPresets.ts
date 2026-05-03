import { getTextNodeSize } from "./geometry";
import type {
  CanvasLayout,
  CanvasNode,
  CanvasNodeId,
  ImageCanvasNode,
  TextCanvasNode,
  TextSizingMode,
} from "./types";

type WorkExperience = {
  alt: string;
  id: string;
  label: string;
  src: string;
  year: string;
};

type CreateTextNodeInput = {
  backgroundColor?: string;
  borderRadius?: number;
  fontSize: number;
  fontWeight?: number;
  height?: number;
  id: string;
  paddingX?: number;
  paddingY?: number;
  sizingMode?: TextSizingMode;
  textColor?: string;
  value: string;
  width?: number;
  x: number;
  y: number;
};

const HERO_PLACEHOLDER_SRC = "/companies/kaimz.png";
const SURFACE_COLOR = "#ffffff";
const TEXT_COLOR = "#0f172a";

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
    fontSize: 30,
    fontWeight: 500,
    sizingMode: "hug",
    value: "hey there!",
  }),
  createTextNode({
    id: "intro",
    x: 100,
    y: 110,
    width: 420,
    height: 170,
    fontSize: 76,
    fontWeight: 600,
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
    fontSize: 30,
    fontWeight: 500,
    sizingMode: "hug",
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
    fontSize: 28,
    fontWeight: 600,
    sizingMode: "hug",
    value: "University of Waterloo",
  }),
  createTextNode({
    id: "study-waterloo-program",
    x: 240,
    y: 474,
    fontSize: 22,
    fontWeight: 600,
    sizingMode: "hug",
    backgroundColor: SURFACE_COLOR,
    borderRadius: 16,
    paddingX: 14,
    paddingY: 8,
    value: "Computer Science",
  }),
  createTextNode({
    id: "work-heading",
    x: 100,
    y: 580,
    fontSize: 30,
    fontWeight: 500,
    sizingMode: "hug",
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
    fontWeight: 500,
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
    fontSize: 24,
    fontWeight: 500,
    sizingMode: "hug",
    value: "hey there!",
  }),
  createTextNode({
    id: "intro",
    x: 20,
    y: 64,
    width: 180,
    height: 120,
    fontSize: 52,
    fontWeight: 600,
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
    fontSize: 24,
    fontWeight: 500,
    sizingMode: "hug",
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
    fontSize: 18,
    fontWeight: 600,
    sizingMode: "hug",
    value: "University of\nWaterloo",
  }),
  createTextNode({
    id: "study-waterloo-program",
    x: 116,
    y: 296,
    fontSize: 16,
    fontWeight: 600,
    sizingMode: "hug",
    backgroundColor: SURFACE_COLOR,
    borderRadius: 14,
    paddingX: 12,
    paddingY: 6,
    value: "Computer Science",
  }),
  createTextNode({
    id: "work-heading",
    x: 20,
    y: 348,
    fontSize: 24,
    fontWeight: 500,
    sizingMode: "hug",
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
    fontWeight: 500,
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
      companyX: 188,
      imageX: 100,
      labelFontSize: 22,
      rowY: 640,
      size: 64,
      work: WORK_EXPERIENCES[0],
      yearX: 346,
      yearWidthHint: 72,
    }),
    ...createWorkRowNodes({
      companyX: 500,
      imageX: 420,
      labelFontSize: 22,
      rowY: 640,
      size: 64,
      work: WORK_EXPERIENCES[1],
      yearX: 632,
      yearWidthHint: 72,
    }),
    ...createWorkRowNodes({
      companyX: 188,
      imageX: 100,
      labelFontSize: 22,
      rowY: 730,
      size: 64,
      work: WORK_EXPERIENCES[2],
      yearX: 382,
      yearWidthHint: 72,
    }),
    ...createWorkRowNodes({
      companyX: 500,
      imageX: 420,
      labelFontSize: 22,
      rowY: 730,
      size: 64,
      work: WORK_EXPERIENCES[3],
      yearX: 676,
      yearWidthHint: 72,
    }),
    ...createWorkRowNodes({
      companyX: 188,
      imageX: 100,
      labelFontSize: 22,
      rowY: 820,
      size: 64,
      work: WORK_EXPERIENCES[4],
      yearX: 348,
      yearWidthHint: 72,
    }),
  ];
}

function createMobileWorkNodes(): CanvasNode[] {
  return WORK_EXPERIENCES.flatMap((work, index) =>
    createWorkRowNodes({
      companyX: 82,
      imageX: 20,
      labelFontSize: 16,
      rowY: 396 + index * 58,
      size: 44,
      work,
      yearX: 232,
      yearWidthHint: 68,
    }),
  );
}

function createWorkRowNodes({
  companyX,
  imageX,
  labelFontSize,
  rowY,
  size,
  work,
  yearX,
  yearWidthHint,
}: {
  companyX: number;
  imageX: number;
  labelFontSize: number;
  rowY: number;
  size: number;
  work: WorkExperience;
  yearX: number;
  yearWidthHint: number;
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
      y: rowY + 8,
      fontSize: labelFontSize,
      fontWeight: 600,
      sizingMode: "hug",
      backgroundColor: SURFACE_COLOR,
      borderRadius: 16,
      paddingX: 14,
      paddingY: 8,
      value: work.label,
    }),
    createTextNode({
      id: `work-${work.id}-year`,
      x: yearX,
      y: rowY + 8,
      width: yearWidthHint,
      fontSize: Math.max(labelFontSize - 2, 14),
      fontWeight: 600,
      sizingMode: "hug",
      backgroundColor: SURFACE_COLOR,
      borderRadius: 16,
      paddingX: 12,
      paddingY: 8,
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

function createTextNode(input: CreateTextNodeInput): TextCanvasNode {
  const sizingMode = input.sizingMode ?? "fixed";
  const paddingX = input.paddingX ?? 0;
  const paddingY = input.paddingY ?? 0;
  const fontWeight = input.fontWeight ?? 500;
  const textColor = input.textColor ?? TEXT_COLOR;
  const backgroundColor = input.backgroundColor ?? "transparent";
  const borderRadius = input.borderRadius ?? 0;
  const derivedSize =
    sizingMode === "hug"
      ? getTextNodeSize({
          fontSize: input.fontSize,
          fontWeight,
          paddingX,
          paddingY,
          value: input.value,
        })
      : null;
  const width = derivedSize?.width ?? input.width;
  const height = derivedSize?.height ?? input.height;

  if (typeof width !== "number" || typeof height !== "number") {
    throw new Error(`Fixed text node "${input.id}" requires width and height.`);
  }

  return {
    id: input.id,
    type: "text",
    x: input.x,
    y: input.y,
    width,
    height,
    baseWidth: width,
    baseHeight: height,
    fontSize: input.fontSize,
    baseFontSize: input.fontSize,
    value: input.value,
    sizingMode,
    textColor,
    backgroundColor,
    fontWeight,
    paddingX,
    paddingY,
    borderRadius,
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
