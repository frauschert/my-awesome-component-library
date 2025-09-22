# Copilot Instructions for my-awesome-component-library

These are practical rules for AI coding agents working in this repo. Keep answers concise and code-first.

## Project overview

-   TypeScript + React component library with Storybook and Jest.
-   Build: Rollup emits CJS/ESM into `lib/` from `src/`. Styles use SCSS via PostCSS.
-   Demos/Visuals: Storybook 8 (React). Tests use Jest + React Testing Library.
-   Public entrypoint: `src/index.ts` (exports components and utilities).

## Core architecture

-   Components live under `src/components/<Name>/` with `Name.tsx`, `index.ts`, and optional `*.stories.tsx`, `*.test.tsx`, and `*.scss`.
    -   Example: `src/components/Button` shows style, accessibility props, and event handling patterns.
-   Utility functions in `src/utility/` are small, focused, and thoroughly tested (e.g., `curry.ts`, `scan.ts`, `atom.ts`).
-   State primitives: `src/utility/atom.ts` provides minimal atoms with:
    -   Writable atoms: `atom(initial) -> { get, set, reset, subscribe }`.
    -   Derived atoms: `atom(get => expr) -> { get, subscribe }` (read-only, throws on set).
    -   Behavior: derived atoms lazily subscribe to deps and coalesce multiple dependency updates within a tick.
-   React hooks: `src/utility/hooks/useAtom.ts` exposes `useAtom`, `useAtomValue`, `useSetAtom`, `useAtomSelector`, `useResetAtom` built on `useSyncExternalStore`.

## Conventions and patterns

-   Keep components self-contained: colocate styles (`*.scss`), tests, and stories with the component.
-   Accessibility: prefer semantic HTML, ARIA attributes, and controlled/disabled behaviors (see `Button.tsx`).
-   Exports: components are default-exported from their folder `index.ts`; package exports are wired in `src/index.ts`.
-   Utilities are pure and documented in `src/utility/README.md`. Add focused tests under `src/utility/__tests__/`.
-   Atoms:
    -   Do not expose setters for derived atoms (runtime error if forced).
    -   `subscribe(cb, notifyImmediately=true)` returns an unsubscribe.
    -   For UI, use hooks rather than manual subscribe where possible.

## Build, test, and docs

-   Build library: run Rollup using the repo’s config.
    -   Task: `yarn build` (Rollup reads `rollup.config.mjs`). Output `lib/`.
-   Storybook for development demos:
    -   Start: `yarn storybook` (port 9001). Build: `yarn build-storybook`.
-   Tests:
    -   Run all: `yarn test` or `npm test`. Coverage: `yarn coverage`.
    -   Jest config uses `babel-jest`, JSDOM, and maps CSS to `__mocks__/styleMock.js`.

## File map (use these as references)

-   Components: `src/components/*` (e.g., `Button/Button.tsx`, `Button/Button.stories.tsx`).
-   Utilities: `src/utility/*` (e.g., `atom.ts`, `curry.ts`, `scan.ts`). Docs at `src/utility/README.md`.
-   Hooks: `src/utility/hooks/useAtom.ts` (React entrypoints for atoms).
-   Entrypoint: `src/index.ts` (exports for library consumers).
-   Tooling: `rollup.config.mjs`, `jest.config.ts`, `babel.config.js`, `tsconfig.json`.

## Coding expectations for agents

-   Follow existing patterns and naming. Prefer small, composable utilities.
-   Keep public APIs stable; when you add new public exports, update `src/index.ts`, tests, and Storybook if relevant.
-   Tests first (or together): add minimal happy-path + edge-case tests when changing utilities or hooks.
-   Don’t introduce new runtime deps lightly; prefer dev-only tooling. Use existing stack (React 18, TS4.x, Storybook 8, Jest 29).
-   TypeScript: maintain strict typings, especially for utility generics and atom read-only vs writable distinctions.
-   Styling: keep SCSS co-located with components; use BEM-like classnames; leverage `utility/classnames` for conditional classes.

## Integration guidance

-   The library should not depend on app-level stores. Use atoms internally for examples; consumers can integrate with Redux or others externally.
-   Storybook is the showcase—new interactive behavior should include a small story for discoverability.

## Example patterns

-   Writable atom usage:
    -   `const count = atom(0); const [n, setN] = useAtom(count); const reset = useResetAtom(count);`
-   Derived atom usage:
    -   `const total = atom(get => get(subtotal) + get(tax)); const value = useAtomValue(total);`
-   Component export pattern:
    -   `src/components/Foo/index.ts` -> `export { default } from './Foo'`

## What to avoid

-   Adding global state or side effects in components or utilities.
-   Re-render-heavy patterns; prefer selectors and derived atoms.
-   Over-engineering: keep utilities tiny and focused.

If anything here is unclear or missing (e.g., a component pattern you want documented), let me know and I’ll refine this file.
