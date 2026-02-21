import React from 'react'
import './ErrorBoundary.scss'

export interface FallbackProps {
    error: Error
    resetError: () => void
}

export interface ErrorBoundaryProps {
    /** Custom fallback UI. Receives the error and reset function. */
    fallback?: React.ReactNode | ((props: FallbackProps) => React.ReactNode)
    /** Called when an error is caught */
    onError?: (error: Error, info: React.ErrorInfo) => void
    /** Called after the error is reset */
    onReset?: () => void
    children: React.ReactNode
}

interface ErrorBoundaryState {
    error: Error | null
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    static displayName = 'ErrorBoundary'

    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.props.onError?.(error, info)
    }

    handleReset = () => {
        this.setState({ error: null })
        this.props.onReset?.()
    }

    render() {
        const { error } = this.state
        const { fallback, children } = this.props

        if (error) {
            if (typeof fallback === 'function') {
                return fallback({ error, resetError: this.handleReset })
            }

            if (fallback) {
                return fallback
            }

            return (
                <div className="error-boundary" role="alert">
                    <div className="error-boundary__icon" aria-hidden="true">
                        {'⚠'}
                    </div>
                    <h2 className="error-boundary__title">
                        Something went wrong
                    </h2>
                    <p className="error-boundary__message">{error.message}</p>
                    <button
                        className="error-boundary__reset"
                        onClick={this.handleReset}
                    >
                        Try again
                    </button>
                </div>
            )
        }

        return children
    }
}

export default ErrorBoundary
