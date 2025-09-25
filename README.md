# my-awesome-component-library

## Toast – quick start

Lightweight, accessible toasts with variants, auto-dismiss, and a simple global notify API.

### Setup

Wrap your app once with the provider and choose a default position:

```tsx
import { ToastProvider } from './src/components/Toast'

export function App() {
    return (
        <ToastProvider position="bottom-right" maxVisible={3} dismissOnEscape>
            {/* your app */}
        </ToastProvider>
    )
}
```

### Show a toast

Use the global `notify` helper exported from `components/Toast`:

```tsx
import { notify } from './src/components/Toast'

notify({ content: 'Saved!', variant: 'success', duration: 3000 })
```

### Provider props

-   position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
-   maxVisible?: number — shows only the last N toasts per position
-   dismissOnEscape?: boolean (default true) — Escape key dismisses the most recent toast

### Toast item options

-   content: ReactNode (required)
-   duration?: number — milliseconds; < 0 disables auto-dismiss
-   position?: overrides provider default
-   variant?: 'info' | 'success' | 'warn' | 'error'

### Behavior & a11y

-   Auto-dismiss pauses on hover/focus and resumes on leave/blur
-   Click anywhere on a toast to dismiss; close button included with aria-label
-   Role is status for info/success and alert for warn/error; aria-live="polite", aria-atomic="true"

See Storybook → Components/Toast for an interactive demo.
