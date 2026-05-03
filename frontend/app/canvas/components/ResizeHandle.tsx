import type { PointerEvent } from "react";
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

const HANDLE_CLASS_BY_HANDLE: Record<ResizeHandle, string> = {
  "top-left": "-left-1.5 -top-1.5 cursor-nwse-resize",
  "top-right": "-right-1.5 -top-1.5 cursor-nesw-resize",
  "bottom-left": "-bottom-1.5 -left-1.5 cursor-nesw-resize",
  "bottom-right": "-bottom-1.5 -right-1.5 cursor-nwse-resize",
};

export function ResizeHandleButton({
  handle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: ResizeHandleButtonProps) {
  return (
    <button
      aria-label={`Resize from ${handle.replace("-", " ")}`}
      className={cx(
        "absolute z-10 size-2.5 border border-blue-500 bg-white",
        HANDLE_CLASS_BY_HANDLE[handle],
      )}
      onPointerCancel={onPointerUp}
      onPointerDown={(event) => onPointerDown(handle, event)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      type="button"
    />
  );
}
