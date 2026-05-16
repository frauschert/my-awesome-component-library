import React from 'react'

export interface WithSuspenseOptions {
    fallback?: React.ReactNode
}

export function withSuspense<P>(
    Component: React.ComponentType<P>,
    options: WithSuspenseOptions = {}
) {
    const { fallback = null } = options

    const Wrapped: React.FC<P> = (props) => (
        <React.Suspense fallback={fallback}>
            <Component {...(props as any)} />
        </React.Suspense>
    )

    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withSuspense(${name})`
    return Wrapped
}
