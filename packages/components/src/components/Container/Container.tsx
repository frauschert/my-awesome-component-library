import React from 'react'
import { classNames } from '../../utility/classnames'
import './container.scss'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps {
    /**
     * Container content
     */
    children: React.ReactNode
    /**
     * Maximum width of the container
     * @default 'lg'
     */
    size?: ContainerSize
    /**
     * Center the container
     * @default true
     */
    center?: boolean
    /**
     * Add horizontal padding
     * @default true
     */
    gutter?: boolean
    /**
     * Make container fluid (100% width)
     * @default false
     */
    fluid?: boolean
    /**
     * Custom className
     */
    className?: string
    /**
     * Inline styles
     */
    style?: React.CSSProperties
    /**
     * HTML element type
     * @default 'div'
     */
    as?: React.ElementType
}

const Container: React.FC<ContainerProps> = ({
    children,
    size = 'lg',
    center = true,
    gutter = true,
    fluid = false,
    className,
    style,
    as: Component = 'div',
}) => {
    const classes = classNames(
        'container',
        !fluid && `container--${size}`,
        fluid && 'container--fluid',
        center && 'container--center',
        gutter && 'container--gutter',
        className
    )

    return (
        <Component className={classes} style={style}>
            {children}
        </Component>
    )
}

export default Container
