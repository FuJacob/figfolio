"use client";

import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FAKE_CURSOR_POSE_SETTLE_MS,
  FAKE_CURSOR_RETARGET_INTERVAL_MS,
  FAKE_CURSOR_SIZE,
} from "../constants";
import {
  createFakeCursorAgents,
  retargetFakeCursorAgents,
  type FakeCursorAgent,
} from "../fakeCursors";
import { useCanvasStore } from "../store";

/**
 * Renders decorative multiplayer-style cursors that periodically glide between
 * random positions inside the current node bounds.
 */
export function FakeCursorOverlay() {
  const activeLayout = useCanvasStore((state) => state.activeLayout);
  const layout = useCanvasStore((state) => state.layouts[state.activeLayout]);
  const layoutRef = useRef(layout);
  const settleTimeoutRef = useRef<number | null>(null);
  const [cursors, setCursors] = useState<FakeCursorAgent[]>([]);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    clearScheduledSettle(settleTimeoutRef.current);
    settleTimeoutRef.current = null;
    setCursors(createFakeCursorAgents(layoutRef.current));
  }, [activeLayout]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCursors((current) => {
        const nextCursors = retargetFakeCursorAgents(current, layoutRef.current);

        schedulePoseSettle(settleTimeoutRef, setCursors);

        return nextCursors;
      });
    }, FAKE_CURSOR_RETARGET_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      const timeoutId = settleTimeoutRef.current;

      clearScheduledSettle(timeoutId);
      settleTimeoutRef.current = null;
    };
  }, []);

  if (cursors.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 motion-reduce:hidden"
    >
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="absolute left-0 top-0 will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            color: cursor.color,
            transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`,
            transitionDuration: `${Math.round(cursor.glideMs)}ms`,
          }}
        >
          <div className="relative">
            <div
              className="will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `rotate(${cursor.rotation}deg) scale(${cursor.scale})`,
                transformOrigin: "6px 4px",
                transitionDuration: `${FAKE_CURSOR_POSE_SETTLE_MS}ms`,
              }}
            >
              <FakeCursorIcon />
            </div>
            <div
              className="absolute top-full mt-2 rounded-full border border-white/80 px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-white shadow-[0_8px_18px_rgba(15,23,42,0.22)]"
              style={{
                backgroundColor: cursor.color,
                left: FAKE_CURSOR_SIZE / 2,
                transform: "translateX(-50%)",
              }}
            >
              {cursor.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function schedulePoseSettle(
  settleTimeoutRef: MutableRefObject<number | null>,
  setCursors: Dispatch<SetStateAction<FakeCursorAgent[]>>,
) {
  clearScheduledSettle(settleTimeoutRef.current);

  settleTimeoutRef.current = window.setTimeout(() => {
    setCursors((current) =>
      current.map((cursor) => ({
        ...cursor,
        rotation: cursor.settleRotation,
        scale: cursor.settleScale,
      })),
    );
    settleTimeoutRef.current = null;
  }, FAKE_CURSOR_POSE_SETTLE_MS);
}

function clearScheduledSettle(timeoutId: number | null) {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
  }
}

function FakeCursorIcon() {
  return (
    <svg
      className="drop-shadow-[0_10px_18px_rgba(15,23,42,0.24)]"
      fill="none"
      height={FAKE_CURSOR_SIZE}
      viewBox="0 0 24 24"
      width={FAKE_CURSOR_SIZE}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M1.50001 4.07491C0.897091 2.46714 2.46715 0.897094 4.07491 1.50001L21.2155 7.92774C23.1217 8.64256 22.8657 11.4162 20.8609 11.77L13.1336 13.1336L11.77 20.8609C11.4162 22.8657 8.64255 23.1217 7.92774 21.2155L1.50001 4.07491ZM3.37267 3.37267L9.8004 20.5133L11.164 12.786C11.3101 11.9582 11.9582 11.3101 12.786 11.164L20.5133 9.8004L3.37267 3.37267Z"
        fill="#ffffff"
        fillRule="evenodd"
      />
      <path
        d="M3.37267 3.37267L9.8004 20.5133L11.164 12.786C11.3101 11.9582 11.9582 11.3101 12.786 11.164L20.5133 9.8004L3.37267 3.37267Z"
        fill="currentColor"
      />
    </svg>
  );
}
