import React, { ComponentType, ReactNode } from 'react'
import { SpinnerProps } from '../types'
import SpinCoin from '../SpinCoin'

export interface LoadingBoundaryProps {
    /** Whether to show the loading spinner */
    loading: boolean
    /** Label for the spinner (accessibility) */
    label?: string
    /** Which spinner component to use */
    spinner?: ComponentType<SpinnerProps>
    /** Additional props to pass to the spinner */
    spinnerProps?: Omit<SpinnerProps, 'label'>
    /** Content to show when not loading */
    children: ReactNode
    /** Custom loading container className */
    className?: string
}

/**
 * LoadingBoundary - Wrapper component that shows a spinner during loading states
 *
 * @example
 * ```tsx
 * const { loading } = useSpinner()
 *
 * <LoadingBoundary loading={loading} label="Loading data" spinner={Ellipsis}>
 *     <UserProfile />
 * </LoadingBoundary>
 * ```
 */
export function LoadingBoundary({
    loading,
    label = 'Loading',
    spinner: Spinner = SpinCoin,
    spinnerProps,
    children,
    className = 'loading-boundary',
}: LoadingBoundaryProps) {
    if (loading) {
        return (
            <div className={className}>
                <Spinner label={label} {...spinnerProps} />
            </div>
        )
    }

    return <>{children}</>
}
