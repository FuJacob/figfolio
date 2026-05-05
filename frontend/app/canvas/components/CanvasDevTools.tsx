"use client";

import { useEffect, useRef, useState } from "react";
import { serializeLayout, serializeLayoutPresetsModule } from "../layoutSerialization";
import { useCanvasStore } from "../store";

const STATUS_RESET_MS = 2400;

/**
 * Dev-only authoring controls for exporting and resetting canvas layouts while
 * the visual editor is acting as the source of truth.
 */
export function CanvasDevTools() {
  const layout = useCanvasStore((state) => state.layout);
  const resetLayout = useCanvasStore((state) => state.resetLayout);
  const [status, setStatus] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  async function handleCopyActiveLayout() {
    await copyText(serializeLayout(layout));
    showStatus("Copied layout");
  }

  async function handleCopyPresetModule() {
    await copyText(serializeLayoutPresetsModule(layout));
    showStatus("Copied preset module");
  }

  function handleResetLayout() {
    resetLayout();
    showStatus("Reset layout");
  }

  function showStatus(nextStatus: string) {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setStatus(nextStatus);
    timeoutRef.current = window.setTimeout(() => {
      setStatus(null);
      timeoutRef.current = null;
    }, STATUS_RESET_MS);
  }

  return (
    <aside className="pointer-events-auto fixed right-4 top-4 z-50 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_12px_36px_rgba(15,23,42,0.12)] backdrop-blur-sm">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Canvas Dev
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={handleCopyActiveLayout}
          type="button"
        >
          Copy Layout
        </button>
        <button
          className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={handleCopyPresetModule}
          type="button"
        >
          Copy Presets File
        </button>
        <button
          className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={handleResetLayout}
          type="button"
        >
          Reset Layout
        </button>
      </div>
      <div className="mt-2 min-h-5 text-xs text-slate-500">
        {status ?? "Dev-only export and reset controls."}
      </div>
    </aside>
  );
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}
