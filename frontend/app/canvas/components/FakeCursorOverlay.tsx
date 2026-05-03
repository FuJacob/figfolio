"use client";

import { useEffect, useRef, useState } from "react";
import {
  FAKE_CURSOR_HEIGHT,
  FAKE_CURSOR_IDLE_SCALE,
  FAKE_CURSOR_MIN_SPEED,
  FAKE_CURSOR_MOVING_SCALE,
  FAKE_CURSOR_RENDER_SCALE,
  FAKE_CURSOR_RETARGET_INTERVAL_MS,
  FAKE_CURSOR_ROTATION_RESPONSE,
  FAKE_CURSOR_SCALE_RESPONSE,
  FAKE_CURSOR_SPRING_DAMPING,
  FAKE_CURSOR_SPRING_STIFFNESS,
  FAKE_CURSOR_WIDTH,
} from "../constants";
import {
  createFakeCursorAgents,
  retargetFakeCursorAgents,
  type FakeCursorAgent,
} from "../fakeCursors";
import type { CanvasPoint } from "../types";
import { useCanvasStore } from "../store";

type AnimatedFakeCursor = FakeCursorAgent & {
  displayPosition: CanvasPoint;
  rotation: number;
  scale: number;
  unwrappedRotation: number;
  velocity: CanvasPoint;
};

/**
 * Renders decorative multiplayer-style cursors that periodically glide between
 * random positions inside the current node bounds.
 */
export function FakeCursorOverlay() {
  const activeLayout = useCanvasStore((state) => state.activeLayout);
  const layout = useCanvasStore((state) => state.layouts[state.activeLayout]);
  const layoutRef = useRef(layout);
  const frameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const targetCursorsRef = useRef<FakeCursorAgent[]>([]);
  const animatedCursorsRef = useRef<AnimatedFakeCursor[]>([]);
  const [animatedCursors, setAnimatedCursors] = useState<AnimatedFakeCursor[]>(
    [],
  );

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    const nextTargets = createFakeCursorAgents(layoutRef.current);
    const nextAnimatedCursors = nextTargets.map(createAnimatedCursor);

    targetCursorsRef.current = nextTargets;
    animatedCursorsRef.current = nextAnimatedCursors;
    lastFrameTimeRef.current = null;
    setAnimatedCursors(nextAnimatedCursors);
  }, [activeLayout]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      targetCursorsRef.current = retargetFakeCursorAgents(
        targetCursorsRef.current,
        layoutRef.current,
      );
    }, FAKE_CURSOR_RETARGET_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (animatedCursorsRef.current.length === 0) {
      return;
    }

    const tick = (timestamp: number) => {
      const lastFrameTime = lastFrameTimeRef.current ?? timestamp;
      const deltaSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.05);

      lastFrameTimeRef.current = timestamp;

      const nextAnimatedCursors = animatedCursorsRef.current.map((cursor) => {
        const targetCursor = targetCursorsRef.current.find(
          (candidate) => candidate.id === cursor.id,
        );

        if (!targetCursor) {
          return cursor;
        }

        const nextMotion = springTowardPoint(
          cursor.displayPosition,
          cursor.velocity,
          targetCursor.position,
          deltaSeconds,
        );
        const speed = Math.hypot(nextMotion.velocity.x, nextMotion.velocity.y);
        const nextRotation =
          speed >= FAKE_CURSOR_MIN_SPEED
            ? unwrapRotation(cursor.unwrappedRotation, nextMotion.velocity)
            : cursor.unwrappedRotation;

        return {
          ...cursor,
          color: targetCursor.color,
          displayPosition: nextMotion.position,
          nodeId: targetCursor.nodeId,
          position: targetCursor.position,
          rotation: lerp(
            cursor.rotation,
            nextRotation,
            FAKE_CURSOR_ROTATION_RESPONSE * deltaSeconds,
          ),
          scale: lerp(
            cursor.scale,
            speed >= FAKE_CURSOR_MIN_SPEED
              ? FAKE_CURSOR_MOVING_SCALE
              : FAKE_CURSOR_IDLE_SCALE,
            FAKE_CURSOR_SCALE_RESPONSE * deltaSeconds,
          ),
          unwrappedRotation: nextRotation,
          velocity: nextMotion.velocity,
        };
      });

      animatedCursorsRef.current = nextAnimatedCursors;
      setAnimatedCursors(nextAnimatedCursors);
      frameIdRef.current = window.requestAnimationFrame(tick);
    };

    frameIdRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameIdRef.current !== null) {
        window.cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
      lastFrameTimeRef.current = null;
    };
  }, [activeLayout]);

  if (animatedCursors.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 motion-reduce:hidden"
    >
      {animatedCursors.map((cursor) => (
        <div
          key={cursor.id}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            color: cursor.color,
            transform: [
              `translate(${cursor.displayPosition.x}px, ${cursor.displayPosition.y}px)`,
              "translate(-50%, -12%)",
            ].join(" "),
          }}
        >
          <div className="relative">
            <div
              className="will-change-transform"
              style={{
                transform: `rotate(${cursor.rotation}deg) scale(${cursor.scale})`,
                transformOrigin: "50% 12%",
              }}
            >
              <FakeCursorIcon />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function createAnimatedCursor(cursor: FakeCursorAgent): AnimatedFakeCursor {
  return {
    ...cursor,
    displayPosition: cursor.position,
    rotation: 0,
    scale: FAKE_CURSOR_IDLE_SCALE,
    unwrappedRotation: 0,
    velocity: { x: 0, y: 0 },
  };
}

function springTowardPoint(
  position: CanvasPoint,
  velocity: CanvasPoint,
  target: CanvasPoint,
  deltaSeconds: number,
): {
  position: CanvasPoint;
  velocity: CanvasPoint;
} {
  const damping = Math.pow(FAKE_CURSOR_SPRING_DAMPING, deltaSeconds * 60);
  const nextVelocity = {
    x:
      (velocity.x +
        (target.x - position.x) * FAKE_CURSOR_SPRING_STIFFNESS * deltaSeconds) *
      damping,
    y:
      (velocity.y +
        (target.y - position.y) * FAKE_CURSOR_SPRING_STIFFNESS * deltaSeconds) *
      damping,
  };

  return {
    position: {
      x: position.x + nextVelocity.x * deltaSeconds,
      y: position.y + nextVelocity.y * deltaSeconds,
    },
    velocity: nextVelocity,
  };
}

function unwrapRotation(
  previousRotation: number,
  velocity: CanvasPoint,
): number {
  const rawRotation = (Math.atan2(velocity.y, velocity.x) * 180) / Math.PI + 90;
  let rotationDelta = rawRotation - normalizeAngle(previousRotation);

  if (rotationDelta > 180) {
    rotationDelta -= 360;
  }

  if (rotationDelta < -180) {
    rotationDelta += 360;
  }

  return previousRotation + rotationDelta;
}

function normalizeAngle(angle: number): number {
  let normalized = angle % 360;

  if (normalized < 0) {
    normalized += 360;
  }

  return normalized;
}

function lerp(from: number, to: number, amount: number): number {
  const clampedAmount = Math.min(Math.max(amount, 0), 1);

  return from + (to - from) * clampedAmount;
}

function FakeCursorIcon() {
  return (
    <svg
      className="drop-shadow-[0_10px_18px_rgba(15,23,42,0.24)]"
      fill="none"
      height={FAKE_CURSOR_HEIGHT}
      viewBox="0 0 50 54"
      width={FAKE_CURSOR_WIDTH}
      xmlns="http://www.w3.org/2000/svg"
      style={{ scale: FAKE_CURSOR_RENDER_SCALE }}
    >
      <g filter="url(#fake-cursor-shadow)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="currentColor"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="fake-cursor-shadow"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
