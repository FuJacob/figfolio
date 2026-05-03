import type { CSSProperties, PointerEvent } from "react";
import type { ResizeHandle } from "../types";
import { cx } from "../utils/classNames";

type ResizeHandleButtonProps = {
  handle: ResizeHandle;
  onPointerDown: (
    handle: ResizeHandle,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
};

type ResizeHandlePresentation = {
  className: string;
  style?: CSSProperties;
};

const HANDLE_PRESENTATION_BY_HANDLE: Record<
  ResizeHandle,
  ResizeHandlePresentation
> = {
  "top-left": {
    className: "-left-2 -top-2 size-4 cursor-nwse-resize",
  },
  "top-right": {
    className: "-right-2 -top-2 size-4 cursor-nesw-resize",
  },
  "bottom-right": {
    className: "-bottom-2 -right-2 size-4 cursor-nwse-resize",
  },
  "bottom-left": {
    className: "-bottom-2 -left-2 size-4 cursor-nesw-resize",
  },
};

export function ResizeHandleButton({
  handle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: ResizeHandleButtonProps) {
  const presentation = HANDLE_PRESENTATION_BY_HANDLE[handle];

  return (
    <button
      aria-label={`Resize from ${handle.replace("-", " ")}`}
      className={cx(
        "pointer-events-auto absolute z-10 rounded-md border-4 border-sky-500 bg-white shadow-sm",
        presentation.className,
      )}
      onPointerCancel={onPointerUp}
      onPointerDown={(event) => onPointerDown(handle, event)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        ...presentation.style,
        touchAction: "none",
      }}
      type="button"
    />
  );
}
