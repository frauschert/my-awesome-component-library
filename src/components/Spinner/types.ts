import { Color } from '../../utility/types'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

export type SpinnerVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'

export type SpinnerProps = {
    /** Hex color for the spinner (overrides variant) */
    color?: Color
    /** Theme color variant */
    variant?: SpinnerVariant
    /** Size - use semantic sizes or custom pixel value */
    size?: SpinnerSize
    /** Additional CSS class names */
    className?: string
    /** Accessible label describing what is loading. Defaults to "Loading" */
    label?: string
    /** Animation speed multiplier (default: 1, higher = faster) */
    speed?: number
}
