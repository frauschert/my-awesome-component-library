# Copilot Instructions for my-awesome-component-library

AI coding guide for this TypeScript + React component library. Keep answers concise and code-first.

## Project Overview

**Stack**: TypeScript 4.x • React 18 • SCSS modules • Storybook 8 • Jest 29 • Rollup bundler  
**Outputs**: CJS (`lib/index.js`) + ESM (`lib/index.esm.js`) + types (`lib/index.d.ts`)  
**Dev server**: `yarn storybook` (port 9001) • Tests: `yarn test` • Build: `yarn build`

## Architecture

### Component Structure

```
src/components/<Name>/
├── Name.tsx          # Component implementation
├── Name.scss         # Colocated styles (CSS modules)
├── Name.stories.tsx  # Storybook demos (optional, MUST include `import React from 'react'`)
├── Name.test.tsx     # Jest tests (optional)
└── index.ts          # Re-export: export { default } from './Name'
```

**Key patterns**:

-   Accessibility-first: semantic HTML, ARIA attributes, keyboard nav (see `Button.tsx`)
-   Discriminated unions for variant props (see `ButtonProps` circle vs standard variants)
-   Forward refs for DOM access: `forwardRef<HTMLElement, Props>`
-   Use `utility/classnames` for conditional classes
-   SCSS uses CSS variables for theming (see Theming section)
-   **Storybook stories**: Always include `import React from 'react'` as the first import to avoid runtime errors

### State Management

**Atoms** (`src/utility/atom.ts`) — lightweight observables:

```ts
// Writable: atom(initial) -> { get, set, reset, subscribe }
const count = atom(0)
const [n, setN] = useAtom(count)

// Derived (read-only): atom(get => expr)
const doubled = atom((get) => get(count) * 2)
const value = useAtomValue(doubled) // no setter
```

-   Derived atoms lazy-subscribe and coalesce updates within a tick
-   React hooks: `useAtom`, `useAtomValue`, `useSetAtom`, `useAtomSelector`, `useResetAtom` (via `useSyncExternalStore`)
-   Don't expose setters for derived atoms (throws at runtime)

### Utilities (`src/utility/`)

Small, pure, well-tested FP helpers: `curry`, `pipe`, `scan`, `memoize`, `debounce`, `throttle`, `lens`, etc.  
**Docs**: `src/utility/README.md` has full API + examples for each.  
**Tests**: `src/utility/__tests__/*.test.ts` — write focused tests for new utilities.

### Hooks (`src/utility/hooks/`)

30+ React hooks documented in `src/utility/hooks/README.md`:

-   State: `useLocalStorage`, `useSessionStorage`, `usePrevious`, `useDebounce`, `useThrottle`
-   Events: `useKeyPress`, `useEventListener`, `useOnClickOutside`, `useClickAway`
-   Browser: `useMediaQuery`, `useColorScheme`, `useWindowSize`, `useFullscreen`, `useIdle`
-   Observables: `useIntersectionObserver`, `useResizeObserver`, `useOnScreen`
-   Perf: `useWhyDidYouUpdate` (debug re-renders)

## Theming System

**CSS Custom Properties** (not SCSS themify mixin — deprecated for Portal compatibility).

**How it works**:

1. `ThemeProvider` applies `theme--light` or `theme--dark` class to `<html>`
2. Components use CSS variables: `background-color: var(--theme-bg-primary)`
3. Works in Portals (Select dropdowns, Modals, ContextMenus) — theme propagates globally

**Variables** (`src/styles/_theme-vars.scss`):

```scss
:root {
    --theme-primary: #408bbd;
    --theme-bg-primary: #ffffff;
    --theme-text-primary: #333333;
    // ... 40+ tokens
}
.theme--dark {
    --theme-primary: #61b0e7;
    --theme-bg-primary: #222222;
    // ...
}
```

**Migration**: Replace `@include themify() { background: themed('primaryColor') }` with `background: var(--theme-primary)`.  
**Context**: `useTheme()` from `ThemeContext` — returns `{ theme, resolvedTheme, systemTheme }`.

## Styling Options

### 1. SCSS (Primary — for components)

```scss
@import '../../styles/theme-vars';
.button {
    background: var(--theme-primary);
    padding: var(--spacing-4);
}
```

### 2. CSS-in-JS (Optional — for app-level customization)

```ts
import {
    tokens,
    createStyles,
    useThemeStyles,
} from '@frauschert/my-awesome-component-library'

// Access tokens
const padding = tokens.spacing[4] // '1rem'

// Theme-aware styles
const cardStyles = createStyles(
    (theme) => ({
        backgroundColor: theme.cardBackground,
        padding: tokens.spacing[4],
    }),
    'light'
)
```

**Docs**: `src/styles/README.md`, `CSS_IN_JS_FEATURE.md`  
**Use for**: dynamic theming, runtime styling, user-generated components  
**Prefer SCSS for**: library components (smaller bundles, compile-time optimization)

## Build & Test Workflows

### Build Commands

```bash
yarn build          # Rollup: src/ -> lib/ (CJS+ESM+types)
yarn storybook      # Dev server on :9001
yarn build-storybook # Static Storybook build
```

**Rollup config** (`rollup.config.mjs`):

-   Plugins: typescript2, postcss (SCSS), svgr, peerDepsExternal
-   Outputs: `lib/index.js` (CJS), `lib/index.esm.js` (ESM), `lib/index.d.ts`
-   CSS extracted to `lib/index.css` and `lib/index.esm.css`

### Test Commands

```bash
yarn test           # Jest with React Testing Library
yarn coverage       # Jest coverage report
```

**Jest config** (`jest.config.ts`):

-   Environment: jsdom
-   Setup: `src/jest-setup.ts` (imports `@testing-library/jest-dom`)
-   Mocks: `__mocks__/styleMock.js` (CSS), `__mocks__/svgMock.js` (SVGs)
-   Transform: babel-jest
-   Coverage: excludes stories, types, index files

### Linting

```bash
yarn lint           # ESLint (eslint.config.mjs)
yarn lint:fix       # Auto-fix issues
```

## Public API Maintenance

**When adding components/utilities**:

1. Export from `src/index.ts` (components + types)
2. Add Storybook story for discoverability
3. Write tests (happy path + edge cases)
4. Update relevant README (utility/README.md or hooks/README.md)

**Type exports**: Export both component and prop types separately:

```ts
import Button from './components/Button'
import type {
    ButtonProps,
    ButtonVariant,
    ButtonSize,
} from './components/Button'
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
```

## Critical Don'ts

-   ❌ **No runtime deps without justification** — peer deps only (React, React-DOM). Tooling deps go to devDependencies.
-   ❌ **No global state** — atoms are internal; consumers integrate externally.
-   ❌ **No SCSS themify mixin** — use CSS variables (`var(--theme-*)`) for Portal compatibility.
-   ❌ **No direct DOM manipulation** — use refs + React patterns.
-   ❌ **No object/array recreation in render** — memoize with `useMemo`/`useCallback` (debug with `useWhyDidYouUpdate`).
-   ❌ **No export from nested paths** — consumers import from package root only.

## TypeScript Patterns

**Strict mode enabled** — maintain type safety:

-   Discriminated unions for variant props
-   Generic constraints for utilities: `<T extends Record<string, unknown>>`
-   Atom type distinctions: `WritableAtom<T>` vs `ReadOnlyAtom<T>`
-   Ref types: `RefObject<HTMLDivElement>` not `any`

**forwardRef pattern**:

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', ...rest }, ref) => {
        return <button ref={ref} className={`button--${variant}`} {...rest} />
    }
)
Button.displayName = 'Button'
```

## Testing Strategy

**Component tests**: User-centric (Testing Library queries), accessibility checks, interactions.  
**Utility tests**: Edge cases, type transformations, immutability, performance (see `__tests__/` examples).  
**Hook tests**: Mock timers (`jest.useFakeTimers()`), cleanup verification, SSR safety.

**Example**:

```tsx
test('Button handles click', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## Reference Examples

**Best component examples**: `Button`, `Tooltip`, `Modal`, `Select`, `DataGrid`  
**Best utility examples**: `atom`, `lens`, `scan`, `memoize`, `debounce`  
**Best hook examples**: `useAtom`, `useKeyPress`, `useOnScreen`, `useMediaQuery`, `useLocalStorage`

**Documentation sources**:

-   Component patterns: Storybook stories
-   Utility APIs: `src/utility/README.md` (8600+ lines, 42 utilities documented)
-   Hook APIs: `src/utility/hooks/README.md` (4300+ lines, 30+ hooks documented)
-   Theming: `THEMING-GUIDE.md`
-   CSS-in-JS: `CSS_IN_JS_FEATURE.md`, `src/styles/README.md`

## Common Tasks

**Add component**: Create folder, implement with forwardRef, add SCSS with CSS vars, write story, export from `src/index.ts`.  
**Add utility**: Implement in `src/utility/`, add tests, document in `README.md`, export from `src/index.ts`.  
**Add hook**: Implement in `src/utility/hooks/`, add tests with fake timers/cleanup checks, document in `hooks/README.md`, export from `src/index.ts`.  
**Fix theming**: Replace `themify()` with CSS variables, test in both light/dark modes in Storybook.  
**Debug re-renders**: Use `useWhyDidYouUpdate` hook to identify prop changes causing unnecessary renders.
