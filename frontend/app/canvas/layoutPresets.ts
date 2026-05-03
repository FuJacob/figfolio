import { getTextNodeSize } from "./geometry";
import {
  createBlock,
  createBlock as toBlock,
  type LayoutBlock,
  type LayoutFrame,
  type LayoutRect,
  moveBlock,
  hStack,
  vStack,
} from "./layoutUtils";
import type {
  CanvasLayout,
  CanvasNode,
  CanvasNodeId,
  ImageCanvasNode,
  TextCanvasNode,
  TextSizingMode,
} from "./types";

type ExperienceRow = {
  alt: string;
  id: string;
  label: string;
  location: string;
  role: string;
  src: string;
  year: string;
};

type ProjectRow = {
  ctaLabel: string;
  id: string;
  summary: string;
};

type IntroTokens = {
  greetingFontSize: number;
  imageOffsetY: number;
  imageOverflowRight: number;
  imageSize: number;
  nameFontSize: number;
  nameGap: number;
  nameHeight: number;
  nameWidth: number;
};

type ExperienceTokens = {
  columnGap: number;
  headingFontSize: number;
  imageGap: number;
  imageSize: number;
  labelFontSize: number;
  labelHeight: number;
  locationFontSize: number;
  metadataGap: number;
  roleFontSize: number;
  rowGap: number;
  textGap: number;
};

type ProjectTokens = {
  ctaFontSize: number;
  ctaGap: number;
  headingFontSize: number;
  rowGap: number;
  summaryFontSize: number;
  summaryHeight: number;
};

type LayoutTokens = {
  experience: ExperienceTokens;
  frame: LayoutFrame;
  intro: IntroTokens;
  project: ProjectTokens;
  sectionGap: number;
  sectionHeadingGap: number;
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

type SectionResult = {
  bounds: LayoutRect;
  nodes: CanvasNode[];
};

const HERO_PLACEHOLDER_SRC = "/companies/kaimz.png";
const TEXT_COLOR = "#0f172a";

const MOBILE_TOKENS: LayoutTokens = {
  frame: {
    left: 20,
    top: 24,
    width: 320,
  },
  intro: {
    greetingFontSize: 24,
    imageOffsetY: -22,
    imageOverflowRight: 40,
    imageSize: 144,
    nameFontSize: 58,
    nameGap: 16,
    nameHeight: 92,
    nameWidth: 212,
  },
  experience: {
    columnGap: 20,
    headingFontSize: 24,
    imageGap: 18,
    imageSize: 44,
    labelFontSize: 17,
    labelHeight: 42,
    locationFontSize: 15,
    metadataGap: 8,
    roleFontSize: 15,
    rowGap: 22,
    textGap: 8,
  },
  project: {
    ctaFontSize: 18,
    ctaGap: 18,
    headingFontSize: 24,
    rowGap: 22,
    summaryFontSize: 18,
    summaryHeight: 52,
  },
  sectionGap: 38,
  sectionHeadingGap: 22,
};

const DESKTOP_TOKENS: LayoutTokens = {
  frame: {
    left: 360,
    top: 52,
    width: 720,
  },
  intro: {
    greetingFontSize: 34,
    imageOffsetY: -34,
    imageOverflowRight: 116,
    imageSize: 300,
    nameFontSize: 92,
    nameGap: 20,
    nameHeight: 120,
    nameWidth: 360,
  },
  experience: {
    columnGap: 48,
    headingFontSize: 32,
    imageGap: 24,
    imageSize: 72,
    labelFontSize: 22,
    labelHeight: 34,
    locationFontSize: 19,
    metadataGap: 10,
    roleFontSize: 19,
    rowGap: 28,
    textGap: 10,
  },
  project: {
    ctaFontSize: 20,
    ctaGap: 26,
    headingFontSize: 32,
    rowGap: 28,
    summaryFontSize: 22,
    summaryHeight: 62,
  },
  sectionGap: 54,
  sectionHeadingGap: 24,
};

const EDUCATION_ROW: ExperienceRow = {
  id: "waterloo",
  label: "University of Waterloo",
  role: "Computer Science",
  location: "Waterloo, ON",
  year: "2028",
  src: "/companies/waterloo.png",
  alt: "University of Waterloo logo",
};

const WORK_EXPERIENCES: ExperienceRow[] = [
  {
    id: "ramp",
    label: "Ramp",
    role: "Engineering",
    location: "Boston, MA",
    year: "2025",
    src: "/companies/ramp.jpeg",
    alt: "Ramp logo",
  },
  {
    id: "uber",
    label: "Uber",
    role: "Engineering",
    location: "Toronto, ON",
    year: "YYYY",
    src: "/companies/uber.png",
    alt: "Uber logo",
  },
  {
    id: "hubspot",
    label: "HubSpot",
    role: "Engineering",
    location: "Cambridge, MA",
    year: "YYYY",
    src: "/companies/hubspot.png",
    alt: "HubSpot logo",
  },
  {
    id: "bridgewell",
    label: "Bridgewell",
    role: "Engineering",
    location: "Toronto, ON",
    year: "YYYY",
    src: "/companies/bridgewell.png",
    alt: "Bridgewell logo",
  },
  {
    id: "kaimz",
    label: "Kaimz",
    role: "Engineering",
    location: "Toronto, ON",
    year: "YYYY",
    src: "/companies/kaimz.png",
    alt: "Kaimz logo",
  },
];

const PROJECT_ROWS: ProjectRow[] = [
  {
    ctaLabel: "GitHub",
    id: "phishing-sim",
    summary: "Phishing simulator for banks aspdo kaspd",
  },
  {
    ctaLabel: "GitHub",
    id: "sales-copilot",
    summary: "Realtime meeting copilot for sales teams",
  },
  {
    ctaLabel: "GitHub",
    id: "ops-portal",
    summary: "Interactive onboarding portal for fintech ops",
  },
];

const DESKTOP_NODES = buildPortfolioLayout("desktop", DESKTOP_TOKENS);
const MOBILE_NODES = buildPortfolioLayout("mobile", MOBILE_TOKENS);

/**
 * Builds the same mobile-first composition for both breakpoints, with desktop
 * only swapping layout tokens and a centered authoring frame.
 */
function buildPortfolioLayout(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
): CanvasNode[] {
  const intro = buildIntroSection(layoutMode, tokens);
  const study = buildSection({
    body: buildExperienceList(
      layoutMode,
      tokens,
      [EDUCATION_ROW],
      "education",
    ),
    frame: withSectionTop(tokens.frame, intro.bounds.y + intro.bounds.height + tokens.sectionGap),
    heading: "I study",
    headingFontSize: tokens.experience.headingFontSize,
    id: `${layoutMode}-study`,
    sectionHeadingGap: tokens.sectionHeadingGap,
  });
  const work = buildSection({
    body: buildExperienceList(
      layoutMode,
      tokens,
      WORK_EXPERIENCES,
      "work",
    ),
    frame: withSectionTop(tokens.frame, study.bounds.y + study.bounds.height + tokens.sectionGap),
    heading: "I work(ed) at",
    headingFontSize: tokens.experience.headingFontSize,
    id: `${layoutMode}-work`,
    sectionHeadingGap: tokens.sectionHeadingGap,
  });
  const built = buildSection({
    body: buildProjectList(layoutMode, tokens, PROJECT_ROWS, "project"),
    frame: withSectionTop(tokens.frame, work.bounds.y + work.bounds.height + tokens.sectionGap),
    heading: "I've built",
    headingFontSize: tokens.project.headingFontSize,
    id: `${layoutMode}-built`,
    sectionHeadingGap: tokens.sectionHeadingGap,
  });

  return [...intro.nodes, ...study.nodes, ...work.nodes, ...built.nodes];
}

function buildIntroSection(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
): SectionResult {
  const greeting = toBlock([
    createTextNode({
      id: `${layoutMode}-greeting`,
      x: 0,
      y: 0,
      fontSize: tokens.intro.greetingFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: "Hey there, I'm",
    }),
  ]);
  const name = toBlock([
    createTextNode({
      id: `${layoutMode}-name`,
      x: 0,
      y: 0,
      width: tokens.intro.nameWidth,
      height: tokens.intro.nameHeight,
      fontSize: tokens.intro.nameFontSize,
      fontWeight: 600,
      value: "Jacob Fu",
    }),
  ]);
  const textColumn = vStack([greeting, name], {
    x: 0,
    y: 0,
    gap: tokens.intro.nameGap,
  });
  const heroImage = toBlock([
    createImageNode({
      id: `${layoutMode}-hero-image`,
      alt: "Hero placeholder image",
      src: HERO_PLACEHOLDER_SRC,
      x: tokens.frame.width - tokens.intro.imageSize + tokens.intro.imageOverflowRight,
      y: tokens.intro.imageOffsetY,
      width: tokens.intro.imageSize,
      height: tokens.intro.imageSize,
      fit: "cover",
    }),
  ]);
  const localSection = createBlock([...textColumn.nodes, ...heroImage.nodes]);
  const section = moveBlock(localSection, tokens.frame.left, tokens.frame.top);

  return {
    nodes: section.nodes,
    bounds: section.bounds,
  };
}

function buildExperienceList(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
  rows: ExperienceRow[],
  sectionId: string,
): LayoutBlock {
  const blocks = rows.map((row) =>
    buildExperienceRow(layoutMode, tokens, sectionId, row),
  );

  return vStack(blocks, {
    x: 0,
    y: 0,
    gap: tokens.experience.rowGap,
  });
}

function buildExperienceRow(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
  sectionId: string,
  row: ExperienceRow,
): LayoutBlock {
  const experience = tokens.experience;
  const image = toBlock([
    createImageNode({
      id: `${layoutMode}-${sectionId}-${row.id}-image`,
      alt: row.alt,
      src: row.src,
      x: 0,
      y: 0,
      width: experience.imageSize,
      height: experience.imageSize,
      fit: "contain",
    }),
  ]);
  const year = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-year`,
      x: 0,
      y: 0,
      fontSize: experience.locationFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: row.year,
    }),
  ]);
  const location = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-location`,
      x: 0,
      y: 0,
      fontSize: experience.locationFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: row.location,
    }),
  ]);
  const metadataColumn = vStack([year, location], {
    x: 0,
    y: 0,
    align: "end",
    gap: experience.metadataGap,
  });
  const availableLabelWidth = Math.max(
    140,
    tokens.frame.width -
      experience.imageSize -
      experience.imageGap -
      experience.columnGap -
      metadataColumn.bounds.width,
  );
  const label = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-label`,
      x: 0,
      y: 0,
      width: availableLabelWidth,
      height: experience.labelHeight,
      fontSize: experience.labelFontSize,
      fontWeight: 600,
      value: row.label,
    }),
  ]);
  const role = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-role`,
      x: 0,
      y: 0,
      fontSize: experience.roleFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: row.role,
    }),
  ]);
  const textColumn = vStack([label, role], {
    x: 0,
    y: 0,
    gap: experience.textGap,
    width: availableLabelWidth,
  });
  const leftCluster = hStack([image, textColumn], {
    x: 0,
    y: 0,
    align: "start",
    gap: experience.imageGap,
  });
  const metadataX = Math.max(
    leftCluster.bounds.width + experience.columnGap,
    tokens.frame.width - metadataColumn.bounds.width,
  );
  const positionedMetadata = moveBlock(metadataColumn, metadataX, 0);

  return createBlock([...leftCluster.nodes, ...positionedMetadata.nodes]);
}

function buildProjectList(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
  rows: ProjectRow[],
  sectionId: string,
): LayoutBlock {
  const blocks = rows.map((row) => buildProjectRow(layoutMode, tokens, sectionId, row));

  return vStack(blocks, {
    x: 0,
    y: 0,
    gap: tokens.project.rowGap,
  });
}

function buildProjectRow(
  layoutMode: "desktop" | "mobile",
  tokens: LayoutTokens,
  sectionId: string,
  row: ProjectRow,
): LayoutBlock {
  const cta = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-cta`,
      x: 0,
      y: 0,
      fontSize: tokens.project.ctaFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: row.ctaLabel,
    }),
  ]);
  const summaryWidth = Math.max(
    180,
    tokens.frame.width - cta.bounds.width - tokens.project.ctaGap,
  );
  const summary = toBlock([
    createTextNode({
      id: `${layoutMode}-${sectionId}-${row.id}-summary`,
      x: 0,
      y: 0,
      width: summaryWidth,
      height: tokens.project.summaryHeight,
      fontSize: tokens.project.summaryFontSize,
      fontWeight: 500,
      value: row.summary,
    }),
  ]);
  const positionedCta = moveBlock(cta, tokens.frame.width - cta.bounds.width, 0);

  return createBlock([...summary.nodes, ...positionedCta.nodes]);
}

function buildSection({
  body,
  frame,
  heading,
  headingFontSize,
  id,
  sectionHeadingGap,
}: {
  body: LayoutBlock;
  frame: LayoutFrame;
  heading: string;
  headingFontSize: number;
  id: string;
  sectionHeadingGap: number;
}): SectionResult {
  const headingBlock = toBlock([
    createTextNode({
      id: `${id}-heading`,
      x: 0,
      y: 0,
      fontSize: headingFontSize,
      fontWeight: 500,
      sizingMode: "hug",
      value: heading,
    }),
  ]);
  const localSection = vStack([headingBlock, body], {
    x: 0,
    y: 0,
    gap: sectionHeadingGap,
    width: frame.width,
  });
  const positionedSection = moveBlock(localSection, frame.left, frame.top);

  return {
    nodes: positionedSection.nodes,
    bounds: positionedSection.bounds,
  };
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

function withSectionTop(
  frame: Pick<LayoutFrame, "left" | "width">,
  top: number,
): LayoutFrame {
  return {
    left: frame.left,
    top,
    width: frame.width,
  };
}

export const LAYOUT_PRESETS = {
  desktop: createLayout(DESKTOP_NODES),
  mobile: createLayout(MOBILE_NODES),
} as const;
