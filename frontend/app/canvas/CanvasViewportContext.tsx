"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CanvasViewportTransform } from "./types";

const CanvasViewportContext = createContext<CanvasViewportTransform | null>(
  null,
);

type CanvasViewportProviderProps = {
  children: ReactNode;
  value: CanvasViewportTransform;
};

export function CanvasViewportProvider({
  children,
  value,
}: CanvasViewportProviderProps) {
  return (
    <CanvasViewportContext.Provider value={value}>
      {children}
    </CanvasViewportContext.Provider>
  );
}

export function useCanvasViewport(): CanvasViewportTransform {
  const context = useContext(CanvasViewportContext);

  if (!context) {
    throw new Error(
      "useCanvasViewport must be used within CanvasViewportProvider.",
    );
  }

  return context;
}
