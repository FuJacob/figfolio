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
  "top-left": "-left-2.5 -top-2.5 cursor-nwse-resize",
  "top-right": "-right-2.5 -top-2.5 cursor-nesw-resize",
  "bottom-left": "-bottom-2.5 -left-2.5 cursor-nesw-resize",
  "bottom-right": "-bottom-2.5 -right-2.5 cursor-nwse-resize",
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
        "pointer-events-auto absolute z-10 size-5 rounded-md border-4 border-sky-500 bg-white shadow-sm",
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
