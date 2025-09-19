import React from 'react'

type FallbackRender = (props: {
    error: Error
    reset: () => void
}) => React.ReactNode

export interface ErrorBoundaryOptions {
    fallback?: React.ReactNode | FallbackRender
    onError?: (error: Error, info: React.ErrorInfo) => void
    resetKeys?: unknown[]
    /** Called when resetKeys change */
    onReset?: () => void
}

class ErrorBoundaryInner extends React.Component<
    React.PropsWithChildren<{
        fallback?: React.ReactNode | FallbackRender
        onError?: (error: Error, info: React.ErrorInfo) => void
        resetKeys?: unknown[]
        onReset?: () => void
    }>,
    { error: Error | null }
> {
    state = { error: null as Error | null }

    static getDerivedStateFromError(error: Error) {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        this.props.onError?.(error, info)
    }

    componentDidUpdate(prevProps: Readonly<any>): void {
        if (!this.state.error) return
        const { resetKeys } = this.props
        if (!resetKeys || !prevProps.resetKeys) return
        const changed =
            resetKeys.length !== prevProps.resetKeys.length ||
            resetKeys.some((v, i) => v !== prevProps.resetKeys[i])
        if (changed) {
            this.setState({ error: null })
            this.props.onReset?.()
        }
    }

    private reset = () => this.setState({ error: null })

    render(): React.ReactNode {
        if (this.state.error) {
            const { fallback } = this.props
            if (typeof fallback === 'function') {
                return (fallback as FallbackRender)({
                    error: this.state.error,
                    reset: this.reset,
                })
            }
            return fallback ?? null
        }
        return this.props.children
    }
}

export function withErrorBoundary<P>(
    Component: React.ComponentType<P>,
    options: ErrorBoundaryOptions = {}
) {
    const { fallback, onError, resetKeys, onReset } = options

    const Wrapped: React.FC<P> = (props) => {
        return (
            <ErrorBoundaryInner
                fallback={fallback}
                onError={onError}
                resetKeys={resetKeys}
                onReset={onReset}
            >
                <Component {...(props as any)} />
            </ErrorBoundaryInner>
        )
    }

    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withErrorBoundary(${name})`
    return Wrapped
}
