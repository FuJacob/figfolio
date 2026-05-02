import type { CSSProperties } from "react";

import { FakeCursor } from "./FakeCursor";

type CursorColor =
  | "var(--fake-cursor-blue)"
  | "var(--fake-cursor-purple)"
  | "var(--fake-cursor-green)";

type CursorTrack = {
  id: string;
  label: string;
  color: CursorColor;
  size: number;
  delay: string;
  points: [CursorPoint, CursorPoint, CursorPoint, CursorPoint];
};

type CursorPoint = {
  x: string;
  y: string;
};

const CURSOR_TRACKS: CursorTrack[] = [
  {
    id: "cursor-jules",
    label: "Jules cursor",
    color: "var(--fake-cursor-blue)",
    size: 26,
    delay: "0s",
    points: [
      { x: "4%", y: "8%" },
      { x: "86%", y: "14%" },
      { x: "70%", y: "82%" },
      { x: "12%", y: "90%" },
    ],
  },
  {
    id: "cursor-maya",
    label: "Maya cursor",
    color: "var(--fake-cursor-purple)",
    size: 24,
    delay: "-5.3s",
    points: [
      { x: "88%", y: "84%" },
      { x: "18%", y: "62%" },
      { x: "10%", y: "22%" },
      { x: "82%", y: "42%" },
    ],
  },
  {
    id: "cursor-ren",
    label: "Ren cursor",
    color: "var(--fake-cursor-green)",
    size: 22,
    delay: "-10.6s",
    points: [
      { x: "42%", y: "92%" },
      { x: "74%", y: "6%" },
      { x: "6%", y: "46%" },
      { x: "90%", y: "66%" },
    ],
  },
];

/**
 * FakeCursorOverlay creates the collaborative-canvas illusion.
 *
 * It is intentionally pointer-events-none so visual cursor movement never
 * steals drag, resize, or click interactions from the editable nodes below.
 */
export function FakeCursorOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {CURSOR_TRACKS.map((cursor) => (
        <div
          key={cursor.id}
          className="pointer-events-none absolute left-0 top-0 animate-[fake-cursor-roam_32s_ease-in-out_var(--cursor-delay)_infinite] text-[var(--cursor-color)] [filter:var(--fake-cursor-shadow)]"
          style={{
            "--cursor-color": cursor.color,
            "--cursor-delay": cursor.delay,
            "--cursor-point-0-x": cursor.points[0].x,
            "--cursor-point-0-y": cursor.points[0].y,
            "--cursor-point-1-x": cursor.points[1].x,
            "--cursor-point-1-y": cursor.points[1].y,
            "--cursor-point-2-x": cursor.points[2].x,
            "--cursor-point-2-y": cursor.points[2].y,
            "--cursor-point-3-x": cursor.points[3].x,
            "--cursor-point-3-y": cursor.points[3].y,
            height: cursor.size,
            width: cursor.size,
          } as CSSProperties}
        >
          <FakeCursor label={cursor.label} />
        </div>
      ))}
    </div>
  );
}
