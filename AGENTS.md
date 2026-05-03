# Frontend Engineering Standards

This repo should be treated as a production frontend codebase, even while the product is early.

## Architecture

- Keep route files thin. Next.js route files such as `page.tsx` should compose feature components, not contain interaction logic, geometry math, or large UI implementations.
- Organize by feature when behavior belongs together. A canvas editor should own its `components`, `store`, `types`, `constants`, and pure utilities in one feature folder.
- Keep React components focused on rendering and wiring events. Move domain math, coordinate transforms, snapping, and sizing rules into pure utility functions.
- Prefer explicit domain types over loose primitives. For example, use named types for canvas coordinates, viewport pointer coordinates, bounds, node IDs, and resize handles.
- Centralize constants. Grid size, minimum node dimensions, typography bounds, handle lists, and line-height rules should live in constants files, not repeated inside JSX.

## React And Next.js

- Use the smallest practical `"use client"` boundary. Put it on the interactive feature entry point, then import child components from there.
- Do not return fresh arrays or objects from Zustand selectors unless using an equality function or memoized selector. Select stable references such as IDs, then let children subscribe to individual records.
- Separate durable editor state from ephemeral pointer state. Zustand should own document state such as nodes, selection, bounds, and typography. React local state can own active drag/resize gestures.
- Avoid large components. Split when a component mixes unrelated concerns such as canvas layout, node rendering, resize handles, and geometry calculations.
- Use semantic controls for interactive elements. Resize handles can be buttons with useful labels; decorative elements should not receive focus.

## State And Data

- Store the real document model, not visual hacks. If text visually changes size, store `fontSize`; do not rely on CSS transforms as the source of truth.
- Enforce invariants at the state boundary. Snapping, minimum sizes, and no-op updates should happen in store actions or shared domain utilities.
- Preserve stable ordering separately from maps. Use `nodeIds` for render order and `nodes` as an ID-indexed record for updates.
- No-op when state does not actually change. This prevents unnecessary subscriptions and keeps interaction performance predictable.

## Styling

- Avoid magic numbers in component markup. Promote reusable layout, grid, sizing, and interaction values to constants.
- Keep conditional class names readable through a small utility instead of long interpolated strings.
- Do not let styling define editor behavior. CSS can render selection and handles, but snapping, resizing, and font scaling belong in TypeScript.

## Validation

- Run `pnpm lint` and `pnpm build` from `frontend/` before calling implementation work complete.
- If interaction logic changes, manually exercise selection, drag, resize from every handle, minimum-size clamping, and click-away deselection.
