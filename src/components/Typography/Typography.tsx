import React from 'react'
import { classNames } from '../../utility/classnames'
import './typography.scss'

export type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'overline'

export type TypographyAlign =
    | 'left'
    | 'center'
    | 'right'
    | 'justify'
    | 'inherit'

export type TypographyColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'inherit'
    | 'muted'

export type TypographyWeight =
    | 'light'
    | 'regular'
    | 'medium'
    | 'semibold'
    | 'bold'

export interface TypographyProps {
    /**
     * The content to display
     */
    children: React.ReactNode

    /**
     * Typography variant that defines the semantic element and styling
     * @default 'body1'
     */
    variant?: TypographyVariant

    /**
     * The HTML element to render
     * If not specified, will be inferred from variant
     */
    component?: React.ElementType

    /**
     * Text alignment
     * @default 'inherit'
     */
    align?: TypographyAlign

    /**
     * Text color
     * @default 'inherit'
     */
    color?: TypographyColor

    /**
     * Font weight
     */
    weight?: TypographyWeight

    /**
     * If true, text will not wrap and will be truncated with ellipsis
     * @default false
     */
    noWrap?: boolean

    /**
     * If true, text will have bottom margin
     * @default false
     */
    gutterBottom?: boolean

    /**
     * Additional CSS class names
     */
    className?: string

    /**
     * Inline styles
     */
    style?: React.CSSProperties

    /**
     * Click handler
     */
    onClick?: React.MouseEventHandler<HTMLElement>

    /**
     * ID attribute
     */
    id?: string

    /**
     * Title attribute for tooltips
     */
    title?: string

    /**
     * ARIA label
     */
    ariaLabel?: string
}

/**
 * Typography component for consistent text styling across the application
 */
const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body1',
    component,
    align = 'inherit',
    color = 'inherit',
    weight,
    noWrap = false,
    gutterBottom = false,
    className,
    style,
    onClick,
    id,
    title,
    ariaLabel,
}) => {
    // Determine the component to render based on variant if not explicitly provided
    const getDefaultComponent = (): React.ElementType => {
        switch (variant) {
            case 'h1':
                return 'h1'
            case 'h2':
                return 'h2'
            case 'h3':
                return 'h3'
            case 'h4':
                return 'h4'
            case 'h5':
                return 'h5'
            case 'h6':
                return 'h6'
            case 'subtitle1':
            case 'subtitle2':
            case 'body1':
            case 'body2':
            case 'caption':
            case 'overline':
                return 'p'
            case 'button':
                return 'span'
            default:
                return 'p'
        }
    }

    const Component = component || getDefaultComponent()

    const classes = classNames(
        'typography',
        `typography--${variant}`,
        align !== 'inherit' && `typography--align-${align}`,
        color !== 'inherit' && `typography--color-${color}`,
        weight && `typography--weight-${weight}`,
        noWrap && 'typography--no-wrap',
        gutterBottom && 'typography--gutter-bottom',
        className
    )

    return (
        <Component
            className={classes}
            style={style}
            onClick={onClick}
            id={id}
            title={title}
            aria-label={ariaLabel}
        >
            {children}
        </Component>
    )
}

export default Typography
