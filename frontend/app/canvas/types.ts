export type CanvasNodeId = string;
export type NodeType = "text" | "image";
export type LayoutMode = "mobile" | "desktop";
export type ImageFitMode = "contain" | "cover";
export type TextSizingMode = "fixed" | "hug";

export type CanvasPoint = {
  x: number;
  y: number;
};

export type ViewportPoint = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Bounds = CanvasPoint & Size;

export type BaseCanvasNode = Bounds & {
  id: CanvasNodeId;
  type: NodeType;
  baseWidth: number;
  baseHeight: number;
};

export type TextCanvasNode = BaseCanvasNode & {
  type: "text";
  backgroundColor: string;
  borderRadius: number;
  fontSize: number;
  baseFontSize: number;
  fontWeight: number;
  paddingX: number;
  paddingY: number;
  sizingMode: TextSizingMode;
  textColor: string;
  value: string;
};

export type ImageCanvasNode = BaseCanvasNode & {
  type: "image";
  alt: string;
  fit: ImageFitMode;
  src: string;
};

export type CanvasNode = TextCanvasNode | ImageCanvasNode;

export type CanvasLayout = {
  nodeIds: CanvasNodeId[];
  nodes: Record<CanvasNodeId, CanvasNode>;
};

export type CanvasLayouts = Record<LayoutMode, CanvasLayout>;

export type ResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type DragInteraction = {
  mode: "drag";
  nodeId: CanvasNodeId;
  pointerId: number;
  startPointer: ViewportPoint;
  startNodePosition: CanvasPoint;
};

export type ResizeInteraction = {
  mode: "resize";
  handle: ResizeHandle;
  nodeId: CanvasNodeId;
  pointerId: number;
  startPointer: ViewportPoint;
  startNode: CanvasNode;
};

export type NodeInteraction = DragInteraction | ResizeInteraction;
