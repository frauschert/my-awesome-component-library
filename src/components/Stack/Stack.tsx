import React from 'react'
import { classNames } from '../../utility/classnames'
import './stack.scss'

export type StackDirection = 'horizontal' | 'vertical'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify =
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface StackProps {
    /**
     * Stack content
     */
    children: React.ReactNode
    /**
     * Stack direction
     * @default 'vertical'
     */
    direction?:
        | StackDirection
        | {
              xs?: StackDirection
              sm?: StackDirection
              md?: StackDirection
              lg?: StackDirection
              xl?: StackDirection
          }
    /**
     * Gap between items
     * @default 'md'
     */
    gap?: StackGap
    /**
     * Alignment along cross axis
     * @default 'stretch'
     */
    align?: StackAlign
    /**
     * Alignment along main axis
     * @default 'start'
     */
    justify?: StackJustify
    /**
     * Wrap items to new line
     * @default false
     */
    wrap?: boolean
    /**
     * Reverse the order of items
     * @default false
     */
    reverse?: boolean
    /**
     * Make items fill available space equally
     * @default false
     */
    fill?: boolean
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
    /**
     * Add divider between items
     */
    divider?: React.ReactNode
}

const Stack: React.FC<StackProps> = ({
    children,
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    reverse = false,
    fill = false,
    className,
    style,
    as: Component = 'div',
    divider,
}) => {
    const classes = classNames(
        'stack',
        typeof direction === 'string' && `stack--${direction}`,
        typeof direction === 'object' && [
            direction.xs && `stack--xs-${direction.xs}`,
            direction.sm && `stack--sm-${direction.sm}`,
            direction.md && `stack--md-${direction.md}`,
            direction.lg && `stack--lg-${direction.lg}`,
            direction.xl && `stack--xl-${direction.xl}`,
        ],
        gap !== 'md' && `stack--gap-${gap}`,
        align !== 'stretch' && `stack--align-${align}`,
        justify !== 'start' && `stack--justify-${justify}`,
        wrap && 'stack--wrap',
        reverse && 'stack--reverse',
        fill && 'stack--fill',
        className
    )

    // Handle dividers
    const childrenArray = React.Children.toArray(children)
    const content = divider
        ? childrenArray.reduce<React.ReactNode[]>((acc, child, index) => {
              acc.push(child)
              if (index < childrenArray.length - 1) {
                  acc.push(
                      <div key={`divider-${index}`} className="stack__divider">
                          {divider}
                      </div>
                  )
              }
              return acc
          }, [])
        : children

    return (
        <Component className={classes} style={style}>
            {content}
        </Component>
    )
}

export default Stack
