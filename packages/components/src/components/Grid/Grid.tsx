import React from 'react'
import { classNames } from '../../utility/classnames'
import './grid.scss'

export interface GridProps {
    /**
     * Grid content
     */
    children: React.ReactNode
    /**
     * Number of columns (1-12)
     * @default 12
     */
    columns?:
        | number
        | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
    /**
     * Gap between grid items
     * @default 'md'
     */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    /**
     * Horizontal alignment of grid items
     */
    justifyItems?: 'start' | 'center' | 'end' | 'stretch'
    /**
     * Vertical alignment of grid items
     */
    alignItems?: 'start' | 'center' | 'end' | 'stretch'
    /**
     * Horizontal alignment of grid content
     */
    justifyContent?:
        | 'start'
        | 'center'
        | 'end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    /**
     * Vertical alignment of grid content
     */
    alignContent?:
        | 'start'
        | 'center'
        | 'end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    /**
     * Auto-fit columns with minimum width
     */
    autoFit?: string
    /**
     * Auto-fill columns with minimum width
     */
    autoFill?: string
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

export interface GridItemProps {
    /**
     * Item content
     */
    children: React.ReactNode
    /**
     * Number of columns to span (1-12)
     */
    colSpan?:
        | number
        | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
    /**
     * Number of rows to span
     */
    rowSpan?:
        | number
        | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
    /**
     * Column start position
     */
    colStart?:
        | number
        | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
    /**
     * Row start position
     */
    rowStart?:
        | number
        | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
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

const Grid: React.FC<GridProps> = ({
    children,
    columns = 12,
    gap = 'md',
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    autoFit,
    autoFill,
    className,
    style,
    as: Component = 'div',
}) => {
    const classes = classNames(
        'grid',
        `grid--gap-${gap}`,
        justifyItems && `grid--justify-items-${justifyItems}`,
        alignItems && `grid--align-items-${alignItems}`,
        justifyContent && `grid--justify-content-${justifyContent}`,
        alignContent && `grid--align-content-${alignContent}`,
        typeof columns === 'number' && `grid--cols-${columns}`,
        typeof columns === 'object' && [
            columns.xs && `grid--cols-xs-${columns.xs}`,
            columns.sm && `grid--cols-sm-${columns.sm}`,
            columns.md && `grid--cols-md-${columns.md}`,
            columns.lg && `grid--cols-lg-${columns.lg}`,
            columns.xl && `grid--cols-xl-${columns.xl}`,
        ],
        className
    )

    const customStyles: React.CSSProperties = {
        ...style,
    }

    if (autoFit) {
        customStyles.gridTemplateColumns = `repeat(auto-fit, minmax(${autoFit}, 1fr))`
    } else if (autoFill) {
        customStyles.gridTemplateColumns = `repeat(auto-fill, minmax(${autoFill}, 1fr))`
    }

    return (
        <Component className={classes} style={customStyles}>
            {children}
        </Component>
    )
}

export const GridItem: React.FC<GridItemProps> = ({
    children,
    colSpan,
    rowSpan,
    colStart,
    rowStart,
    className,
    style,
    as: Component = 'div',
}) => {
    const classes = classNames(
        'grid-item',
        typeof colSpan === 'number' && `grid-item--col-span-${colSpan}`,
        typeof colSpan === 'object' && [
            colSpan.xs && `grid-item--col-span-xs-${colSpan.xs}`,
            colSpan.sm && `grid-item--col-span-sm-${colSpan.sm}`,
            colSpan.md && `grid-item--col-span-md-${colSpan.md}`,
            colSpan.lg && `grid-item--col-span-lg-${colSpan.lg}`,
            colSpan.xl && `grid-item--col-span-xl-${colSpan.xl}`,
        ],
        typeof rowSpan === 'number' && `grid-item--row-span-${rowSpan}`,
        typeof rowSpan === 'object' && [
            rowSpan.xs && `grid-item--row-span-xs-${rowSpan.xs}`,
            rowSpan.sm && `grid-item--row-span-sm-${rowSpan.sm}`,
            rowSpan.md && `grid-item--row-span-md-${rowSpan.md}`,
            rowSpan.lg && `grid-item--row-span-lg-${rowSpan.lg}`,
            rowSpan.xl && `grid-item--row-span-xl-${rowSpan.xl}`,
        ],
        typeof colStart === 'number' && `grid-item--col-start-${colStart}`,
        typeof colStart === 'object' && [
            colStart.xs && `grid-item--col-start-xs-${colStart.xs}`,
            colStart.sm && `grid-item--col-start-sm-${colStart.sm}`,
            colStart.md && `grid-item--col-start-md-${colStart.md}`,
            colStart.lg && `grid-item--col-start-lg-${colStart.lg}`,
            colStart.xl && `grid-item--col-start-xl-${colStart.xl}`,
        ],
        typeof rowStart === 'number' && `grid-item--row-start-${rowStart}`,
        typeof rowStart === 'object' && [
            rowStart.xs && `grid-item--row-start-xs-${rowStart.xs}`,
            rowStart.sm && `grid-item--row-start-sm-${rowStart.sm}`,
            rowStart.md && `grid-item--row-start-md-${rowStart.md}`,
            rowStart.lg && `grid-item--row-start-lg-${rowStart.lg}`,
            rowStart.xl && `grid-item--row-start-xl-${rowStart.xl}`,
        ],
        className
    )

    return (
        <Component className={classes} style={style}>
            {children}
        </Component>
    )
}

export default Grid
