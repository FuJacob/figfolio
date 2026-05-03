export type CanvasNodeId = string;
export type NodeType = "text";
export type LayoutMode = "mobile" | "desktop";

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

export type CanvasNode = Bounds & {
  id: CanvasNodeId;
  type: NodeType;
  baseWidth: number;
  baseHeight: number;
  fontSize: number;
  baseFontSize: number;
  value: string;
};

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
