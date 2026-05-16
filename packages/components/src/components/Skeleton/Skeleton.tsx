import React from 'react'
import { classNames } from '../../utility/classnames'
import './skeleton.scss'

type BaseSkeletonProps = {
    /** Width in pixels, percentage, or CSS unit */
    width?: number | string
    /** Height in pixels, percentage, or CSS unit */
    height?: number | string
    /** Border radius in pixels or CSS unit */
    borderRadius?: number | string
    /** Enable shimmer animation (default: true) */
    animate?: boolean
    /** Additional CSS class names */
    className?: string
    /** Accessible label for screen readers */
    'aria-label'?: string
    /** Loading state description (default: 'Loading...') */
    'aria-busy'?: boolean
    /** Data test id for testing */
    'data-testid'?: string
}

export type SkeletonProps = BaseSkeletonProps & {
    /** Shape variant */
    variant?: 'text' | 'circular' | 'rectangular'
}

/**
 * Base Skeleton component for creating placeholder loading states.
 *
 * @example
 * <Skeleton variant="text" width={200} height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 */
export const Skeleton = ({
    variant = 'text',
    width,
    height,
    borderRadius,
    animate = true,
    className,
    'aria-label': ariaLabel = 'Loading...',
    'aria-busy': ariaBusy = true,
    'data-testid': dataTestId,
}: SkeletonProps) => {
    const styles: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius:
            borderRadius !== undefined
                ? typeof borderRadius === 'number'
                    ? `${borderRadius}px`
                    : borderRadius
                : variant === 'circular'
                ? '50%'
                : variant === 'text'
                ? '4px'
                : '8px',
    }

    return (
        <div
            className={classNames(
                'skeleton',
                `skeleton--${variant}`,
                animate && 'skeleton--animate',
                className
            )}
            style={styles}
            role="status"
            aria-label={ariaLabel}
            aria-busy={ariaBusy}
            data-testid={dataTestId}
        />
    )
}

// Legacy components for backward compatibility
export type SkeletonLineProps = {
    /** Size preset (deprecated: use Skeleton with custom width) */
    size?: 'short' | 'medium' | 'large'
    /** Custom width (overrides size preset) */
    width?: number | string
    /** Custom height */
    height?: number | string
    /** Enable animation */
    animate?: boolean
    /** Additional class names */
    className?: string
}

/**
 * @deprecated Use `<Skeleton variant="text" />` instead
 */
export const SkeletonLine = ({
    size = 'medium',
    width,
    height = 20,
    animate = true,
    className,
}: SkeletonLineProps) => {
    const sizeMap = {
        short: '25%',
        medium: '50%',
        large: '75%',
    }

    return (
        <Skeleton
            variant="text"
            width={width ?? sizeMap[size]}
            height={height}
            animate={animate}
            className={className}
        />
    )
}

export type SkeletonImageProps = {
    /** Width in pixels or CSS unit */
    width?: number | string
    /** Height in pixels or CSS unit */
    height?: number | string
    /** Border radius */
    borderRadius?: number | string
    /** Enable animation */
    animate?: boolean
    /** Additional class names */
    className?: string
}

/**
 * @deprecated Use `<Skeleton variant="rectangular" />` instead
 */
export const SkeletonImage = ({
    width = 300,
    height = 300,
    borderRadius = 4,
    animate = true,
    className,
}: SkeletonImageProps) => {
    return (
        <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            borderRadius={borderRadius}
            animate={animate}
            className={className}
        />
    )
}

// Compound component API
Skeleton.Text = (props: Omit<SkeletonProps, 'variant'>) => (
    <Skeleton {...props} variant="text" />
)
Skeleton.Circle = (props: Omit<SkeletonProps, 'variant'>) => (
    <Skeleton {...props} variant="circular" />
)
Skeleton.Rectangle = (props: Omit<SkeletonProps, 'variant'>) => (
    <Skeleton {...props} variant="rectangular" />
)
