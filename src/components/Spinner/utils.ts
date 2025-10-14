import hex from '../../utility/hex'
import type { SpinnerProps, SpinnerSize, SpinnerVariant } from './types'
import type { Color } from '../../utility/types'

export const defaultSpinnerProps: Required<
    Pick<SpinnerProps, 'size' | 'speed'>
> = {
    size: 'md',
    speed: 1,
}

/** Semantic size to pixel mapping */
export const sizeMap: Record<string, number> = {
    xs: 16,
    sm: 24,
    md: 40,
    lg: 64,
    xl: 96,
}

/** Theme variant to color mapping */
export const variantColorMap: Record<SpinnerVariant, Color> = {
    primary: hex('#3b82f6'),
    secondary: hex('#6b7280'),
    success: hex('#10b981'),
    error: hex('#ef4444'),
    warning: hex('#f59e0b'),
    info: hex('#06b6d4'),
}

/** Convert SpinnerSize to pixel value */
export const getSpinnerSize = (size: SpinnerSize = 'md'): number => {
    return typeof size === 'number' ? size : sizeMap[size]
}

/** Get color from variant or custom color */
export const getSpinnerColor = (
    color?: Color,
    variant?: SpinnerVariant
): Color => {
    if (color) return color
    if (variant) return variantColorMap[variant]
    return hex('#81b45e') // fallback
}
