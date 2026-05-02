export type NodeKind = "text" | "image";

export type ResizeHandle = "northWest" | "northEast" | "southWest" | "southEast";

export type NodeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BaseNode = NodeBounds & {
  id: string;
  kind: NodeKind;
};

export type TextNode = BaseNode & {
  kind: "text";
  text: string;
};

export type ImageNode = BaseNode & {
  kind: "image";
  alt: string;
  title: string;
  src?: string;
};

export type PortfolioNode = TextNode | ImageNode;
