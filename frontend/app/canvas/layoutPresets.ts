import { getTextNodeSize, getWrappedTextNodeSize } from "./geometry";
import type {
  CanvasLayout,
  CanvasNode,
  CanvasNodeId,
  ImageFitMode,
  TextAlignMode,
  TextCanvasNode,
  TextSizingMode,
} from "./types";

type TextStyleToken = Pick<
  TextCanvasNode,
  | "backgroundColor"
  | "borderRadius"
  | "fontSize"
  | "fontWeight"
  | "paddingX"
  | "paddingY"
  | "textColor"
>;

type WorkItem = {
  alt: string;
  company: string;
  id: string;
  location: string;
  role: string;
  src: string;
  year: string;
};

type ProjectItem = {
  id: string;
  summary: string;
};

type EnjoyItem = {
  id: string;
  summary: string;
};

type IntroLayoutConfig = {
  greetingX: number;
  greetingY: number;
  heroHeight: number;
  heroWidth: number;
  heroX: number;
  heroY: number;
  nameHeight: number;
  nameWidth: number;
  nameX: number;
  nameY: number;
};

type EducationLayoutConfig = {
  imageSize: number;
  imageX: number;
  labelWidth: number;
  leftX: number;
  rightColumnWidth: number;
  rightEdge: number;
  roleOffsetY: number;
  rowY: number;
};

type WorkLayoutConfig = {
  imageSize: number;
  labelX: number;
  leftX: number;
  locationOffsetY: number;
  rightColumnWidth: number;
  rightEdge: number;
  roleOffsetY: number;
  rowGap: number;
  startY: number;
};

type BulletListLayoutConfig = {
  gap: number;
  startY: number;
  summaryWidth: number;
  x: number;
};

const TRANSPARENT = "transparent";
const TEXT_COLOR = "#0f172a";

const DEFAULT_TEXT_STYLE: TextStyleToken = {
  backgroundColor: TRANSPARENT,
  borderRadius: 0,
  fontSize: 16,
  fontWeight: 500,
  paddingX: 0,
  paddingY: 0,
  textColor: TEXT_COLOR,
};

const TEXT_STYLES = {
  mobileBody: createTextStyle({
    fontSize: 15,
    fontWeight: 500,
  }),
  mobileBullet: createTextStyle({
    fontSize: 14,
    fontWeight: 500,
  }),
  mobileEyebrow: createTextStyle({
    fontSize: 24,
    fontWeight: 500,
  }),
  mobileHeroName: createTextStyle({
    fontSize: 59,
    fontWeight: 600,
  }),
  mobileProject: createTextStyle({
    fontSize: 15,
    fontWeight: 500,
  }),
  mobileSection: createTextStyle({
    fontSize: 19,
    fontWeight: 500,
  }),
  mobileTitle: createTextStyle({
    fontSize: 17,
    fontWeight: 600,
  }),
} as const;

const WORK_ITEMS: readonly WorkItem[] = [
  {
    alt: "Ramp logo",
    company: "Ramp",
    id: "ramp",
    location: "New York City, NY",
    role: "Engineering",
    src: "/companies/ramp.jpeg",
    year: "2025",
  },
  {
    alt: "Uber logo",
    company: "Uber",
    id: "uber",
    location: "Sunnyvale, CA",
    role: "Engineering",
    src: "/companies/uber.png",
    year: "YYYY",
  },
  {
    alt: "HubSpot logo",
    company: "HubSpot",
    id: "hubspot",
    location: "Boston, MA",
    role: "Engineering",
    src: "/companies/hubspot.png",
    year: "YYYY",
  },
  {
    alt: "HubSpot logo",
    company: "HubSpot",
    id: "hubspot-secondary",
    location: "Boston, MA",
    role: "Engineering",
    src: "/companies/hubspot.png",
    year: "YYYY",
  },
] as const;

const PROJECT_ITEMS: readonly ProjectItem[] = [
  {
    id: "phishing-sim",
    summary: "• Phishing simulator for banks",
  },
  {
    id: "sales-copilot",
    summary: "• Meeting copilot for sales teams",
  },
  {
    id: "ops-portal",
    summary: "• Onboarding portal for fintech ops",
  },
] as const;

const ENJOY_ITEMS: readonly EnjoyItem[] = [
  {
    id: "sports",
    summary: "• Playing volleyball 🏐 and badminton 🏸 with friends",
  },
  {
    id: "valorant",
    summary: "• I main Jett on Valorant, peak Ascendant 2 🎮",
  },
  {
    id: "clash-royale",
    summary: "• Permanently banned from Clash Royale 🚫",
  },
] as const;

const MOBILE_FRAME = {
  width: 390,
  height: 980,
} as const;
const LAYOUT_PRESET = buildLayout();

function buildLayout(): CanvasLayout {
  const sectionX = 0;
  const rightEdge = 380;
  const sectionGap = 36;
  const headingToContentGap = 40;
  const bulletListWidth = MOBILE_FRAME.width;

  const introNodes = buildIntroSection("mobile", {
    greetingX: sectionX,
    greetingY: 20,
    heroHeight: 100,
    heroWidth: 100,
    heroX: 280,
    heroY: 20,
    nameHeight: 100,
    nameWidth: 260,
    nameX: sectionX,
    nameY: 40,
  });

  const studyHeadingNodes = buildSectionHeading("mobile-study-heading", {
    style: TEXT_STYLES.mobileSection,
    value: "I study @",
    x: sectionX,
    y: 120,
  });
  const studyNodes = buildEducationSection("mobile", {
    imageSize: 44,
    imageX: sectionX,
    labelWidth: 180,
    leftX: 60,
    rightColumnWidth: 120,
    rightEdge,
    roleOffsetY: 24,
    rowY: 160,
  });

  const enjoyHeadingY = getNodesBottom(studyNodes) + sectionGap;
  const enjoyHeadingNodes = buildSectionHeading("mobile-enjoy-heading", {
    style: TEXT_STYLES.mobileSection,
    value: "Fun facts about me",
    x: sectionX,
    y: enjoyHeadingY,
  });
  const enjoyNodes = buildBulletListSection("mobile-enjoy", ENJOY_ITEMS, {
    gap: 20,
    startY: enjoyHeadingY + headingToContentGap,
    summaryWidth: bulletListWidth,
    x: sectionX,
  });

  const projectsHeadingY = getNodesBottom(enjoyNodes) + sectionGap;
  const projectHeadingNodes = buildSectionHeading("mobile-built-heading", {
    style: TEXT_STYLES.mobileSection,
    value: "Some cool projects I've built",
    x: sectionX,
    y: projectsHeadingY,
  });
  const projectNodes = buildBulletListSection("mobile-project", PROJECT_ITEMS, {
    gap: 20,
    startY: projectsHeadingY + headingToContentGap,
    summaryWidth: bulletListWidth,
    x: sectionX,
  });

  const workHeadingY = getNodesBottom(projectNodes) + sectionGap;
  const workHeadingNodes = buildSectionHeading("mobile-work-heading", {
    style: TEXT_STYLES.mobileSection,
    value: "Some places I work/worked @",
    x: sectionX,
    y: workHeadingY,
  });
  const workNodes = buildWorkSection("mobile", {
    imageSize: 44,
    labelX: 60,
    leftX: sectionX,
    locationOffsetY: 20,
    rightColumnWidth: 120,
    rightEdge,
    roleOffsetY: 24,
    rowGap: 80,
    startY: workHeadingY + headingToContentGap,
  });

  const nodes = [
    ...introNodes,
    ...studyHeadingNodes,
    ...studyNodes,
    ...enjoyHeadingNodes,
    ...enjoyNodes,
    ...projectHeadingNodes,
    ...projectNodes,
    ...workHeadingNodes,
    ...workNodes,
  ];

  return createLayout(
    {
      ...MOBILE_FRAME,
      height: getNodesBottom(nodes) + 40,
    },
    nodes,
  );
}

function buildIntroSection(
  prefix: "mobile",
  config: IntroLayoutConfig,
): CanvasNode[] {
  return [
    createHugTextNode(`${prefix}-greeting`, {
      style: TEXT_STYLES.mobileEyebrow,
      value: "Hey there, I'm",
      x: config.greetingX,
      y: config.greetingY,
    }),
    createFixedTextNode(`${prefix}-name`, {
      height: config.nameHeight,
      style: TEXT_STYLES.mobileHeroName,
      value: "Jacob Fu",
      width: config.nameWidth,
      x: config.nameX,
      y: config.nameY,
    }),
    createImageNode(`${prefix}-hero-image`, {
      alt: "Hero placeholder image",
      fit: "cover",
      height: config.heroHeight,
      src: "/companies/kaimz.png",
      width: config.heroWidth,
      x: config.heroX,
      y: config.heroY,
    }),
  ];
}

function buildEducationSection(
  prefix: "mobile",
  config: EducationLayoutConfig,
): CanvasNode[] {
  const labelNode = createWrapTextNode(`${prefix}-education-waterloo-label`, {
    style: TEXT_STYLES.mobileTitle,
    value: "University of Waterloo",
    width: config.labelWidth,
    x: config.leftX,
    y: config.rowY,
  });
  const roleNode = createHugTextNode(`${prefix}-education-waterloo-role`, {
    style: TEXT_STYLES.mobileBody,
    value: "Computer Science",
    x: config.leftX,
    y: config.rowY + config.roleOffsetY,
  });
  const yearNode = createRightAlignedTextNode(
    `${prefix}-education-waterloo-year`,
    {
      columnWidth: config.rightColumnWidth,
      rightEdge: config.rightEdge,
      style: TEXT_STYLES.mobileBody,
      value: "2028",
      y: config.rowY,
    },
  );
  const locationNode = createRightAlignedTextNode(
    `${prefix}-education-waterloo-location`,
    {
      columnWidth: config.rightColumnWidth,
      rightEdge: config.rightEdge,
      style: TEXT_STYLES.mobileBody,
      value: "Waterloo, ON",
      y: config.rowY + config.roleOffsetY,
    },
  );

  return [
    createImageNode(`${prefix}-education-waterloo-image`, {
      alt: "University of Waterloo logo",
      fit: "contain",
      height: config.imageSize,
      src: "/companies/waterloo.png",
      width: config.imageSize,
      x: config.imageX,
      y: config.rowY,
    }),
    labelNode,
    roleNode,
    yearNode,
    locationNode,
  ];
}

function buildWorkSection(
  prefix: "mobile",
  config: WorkLayoutConfig,
): CanvasNode[] {
  return WORK_ITEMS.flatMap((item, index) => {
    const rowY = config.startY + config.rowGap * index;
    const labelNode = createHugTextNode(`${prefix}-work-${item.id}-label`, {
      style: TEXT_STYLES.mobileTitle,
      value: item.company,
      x: config.labelX,
      y: rowY,
    });
    const roleNode = createHugTextNode(`${prefix}-work-${item.id}-role`, {
      style: TEXT_STYLES.mobileBody,
      value: item.role,
      x: config.labelX,
      y: rowY + config.roleOffsetY,
    });
    const yearNode = createRightAlignedTextNode(
      `${prefix}-work-${item.id}-year`,
      {
        columnWidth: config.rightColumnWidth,
        rightEdge: config.rightEdge,
        style: TEXT_STYLES.mobileBody,
        value: item.year,
        y: rowY,
      },
    );
    const locationNode = createRightAlignedTextNode(
      `${prefix}-work-${item.id}-location`,
      {
        columnWidth: config.rightColumnWidth,
        rightEdge: config.rightEdge,
        style: TEXT_STYLES.mobileBody,
        value: item.location,
        y: rowY + config.locationOffsetY,
      },
    );

    return [
      createImageNode(`${prefix}-work-${item.id}-image`, {
        alt: item.alt,
        fit: "contain",
        height: config.imageSize,
        src: item.src,
        width: config.imageSize,
        x: config.leftX,
        y: rowY,
      }),
      labelNode,
      roleNode,
      yearNode,
      locationNode,
    ];
  });
}

function buildBulletListSection(
  prefix: string,
  items: readonly { id: string; summary: string }[],
  config: BulletListLayoutConfig,
): CanvasNode[] {
  const nodes: CanvasNode[] = [];
  let currentY = config.startY;

  for (const item of items) {
    const node = createWrapTextNode(`${prefix}-${item.id}-summary`, {
      style: TEXT_STYLES.mobileBullet,
      value: item.summary,
      width: config.summaryWidth,
      x: config.x,
      y: currentY,
    });
    nodes.push(node);
    currentY += node.height + config.gap;
  }

  return nodes;
}

function buildSectionHeading(
  id: string,
  input: {
    style: TextStyleToken;
    value: string;
    x: number;
    y: number;
  },
): CanvasNode[] {
  return [
    createHugTextNode(id, {
      style: input.style,
      value: input.value,
      x: input.x,
      y: input.y,
    }),
  ];
}

function createLayout(
  frame: CanvasLayout["frame"],
  nodes: readonly CanvasNode[],
): CanvasLayout {
  return {
    frame: { ...frame },
    nodeIds: nodes.map((node) => node.id),
    nodes: Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<
      CanvasNodeId,
      CanvasNode
    >,
  };
}

function getNodesBottom(nodes: readonly CanvasNode[]): number {
  return nodes.reduce(
    (maxBottom, node) => Math.max(maxBottom, node.y + node.height),
    0,
  );
}

function createTextStyle(
  overrides: Partial<TextStyleToken>,
): TextStyleToken {
  return {
    ...DEFAULT_TEXT_STYLE,
    ...overrides,
  };
}

function createHugTextNode(
  id: string,
  input: {
    style: TextStyleToken;
    value: string;
    x: number;
    y: number;
  },
): CanvasNode {
  const size = getTextNodeSize({
    fontSize: input.style.fontSize,
    fontWeight: input.style.fontWeight,
    paddingX: input.style.paddingX,
    paddingY: input.style.paddingY,
    value: input.value,
  });

  return createTextNodeBase(id, {
    height: size.height,
    sizingMode: "hug",
    style: input.style,
    textAlign: "left",
    value: input.value,
    width: size.width,
    x: input.x,
    y: input.y,
  });
}

function createWrapTextNode(
  id: string,
  input: {
    style: TextStyleToken;
    value: string;
    width: number;
    x: number;
    y: number;
  },
): CanvasNode {
  const size = getWrappedTextNodeSize({
    fontSize: input.style.fontSize,
    fontWeight: input.style.fontWeight,
    paddingX: input.style.paddingX,
    paddingY: input.style.paddingY,
    value: input.value,
    width: input.width,
  });

  return createTextNodeBase(id, {
    height: size.height,
    sizingMode: "wrap",
    style: input.style,
    textAlign: "left",
    value: input.value,
    width: input.width,
    x: input.x,
    y: input.y,
  });
}

function createFixedTextNode(
  id: string,
  input: {
    height: number;
    style: TextStyleToken;
    value: string;
    width: number;
    x: number;
    y: number;
  },
): CanvasNode {
  return createTextNodeBase(id, {
    height: input.height,
    sizingMode: "fixed",
    style: input.style,
    textAlign: "left",
    value: input.value,
    width: input.width,
    x: input.x,
    y: input.y,
  });
}

function createRightAlignedTextNode(
  id: string,
  input: {
    columnWidth: number;
    rightEdge: number;
    style: TextStyleToken;
    value: string;
    y: number;
  },
): CanvasNode {
  const size = getWrappedTextNodeSize({
    fontSize: input.style.fontSize,
    fontWeight: input.style.fontWeight,
    paddingX: input.style.paddingX,
    paddingY: input.style.paddingY,
    value: input.value,
    width: input.columnWidth,
  });

  return createTextNodeBase(id, {
    height: size.height,
    sizingMode: "fixed",
    style: input.style,
    textAlign: "right",
    value: input.value,
    width: input.columnWidth,
    x: input.rightEdge - input.columnWidth,
    y: input.y,
  });
}

function createTextNodeBase(
  id: string,
  input: {
    height: number;
    sizingMode: TextSizingMode;
    style: TextStyleToken;
    textAlign: TextAlignMode;
    value: string;
    width: number;
    x: number;
    y: number;
  },
): CanvasNode {
  return {
    id,
    type: "text",
    x: input.x,
    y: input.y,
    width: input.width,
    height: input.height,
    baseWidth: input.width,
    baseHeight: input.height,
    fontSize: input.style.fontSize,
    baseFontSize: input.style.fontSize,
    value: input.value,
    sizingMode: input.sizingMode,
    textAlign: input.textAlign,
    textColor: input.style.textColor,
    backgroundColor: input.style.backgroundColor,
    fontWeight: input.style.fontWeight,
    paddingX: input.style.paddingX,
    paddingY: input.style.paddingY,
    borderRadius: input.style.borderRadius,
  };
}

function createImageNode(
  id: string,
  input: {
    alt: string;
    fit: ImageFitMode;
    height: number;
    src: string;
    width: number;
    x: number;
    y: number;
  },
): CanvasNode {
  return {
    id,
    alt: input.alt,
    src: input.src,
    x: input.x,
    y: input.y,
    width: input.width,
    height: input.height,
    fit: input.fit,
    type: "image",
    baseWidth: input.width,
    baseHeight: input.height,
  };
}

/**
 * Clones a layout preset so editing session state cannot mutate the authored
 * preset objects by reference.
 */
export function cloneLayout(layout: CanvasLayout): CanvasLayout {
  return {
    frame: { ...layout.frame },
    nodeIds: [...layout.nodeIds],
    nodes: Object.fromEntries(
      Object.entries(layout.nodes).map(([id, node]) => [id, cloneNode(node)]),
    ) as Record<CanvasNodeId, CanvasNode>,
  };
}

function cloneNode(node: CanvasNode): CanvasNode {
  return { ...node };
}

export { LAYOUT_PRESET };
