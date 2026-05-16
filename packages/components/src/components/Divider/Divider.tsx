import React from 'react'
import { classNames } from '../../utility/classnames'
import './Divider.scss'

export interface DividerProps {
    /** Orientation of the divider */
    orientation?: 'horizontal' | 'vertical'
    /** Variant style */
    variant?: 'solid' | 'dashed' | 'dotted'
    /** Optional label text */
    label?: string
    /** Label alignment (only for horizontal) */
    labelAlign?: 'left' | 'center' | 'right'
    /** Spacing around the divider */
    spacing?: 'none' | 'small' | 'medium' | 'large'
    /** Custom className */
    className?: string
    /** Color variant */
    color?: 'default' | 'primary' | 'secondary'
}

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    variant = 'solid',
    label,
    labelAlign = 'center',
    spacing = 'medium',
    className,
    color = 'default',
}) => {
    const hasLabel = !!label && orientation === 'horizontal'

    if (hasLabel) {
        return (
            <div
                className={classNames(
                    'divider-wrapper',
                    `divider-wrapper--${orientation}`,
                    `divider-wrapper--${spacing}`,
                    `divider-wrapper--label-${labelAlign}`,
                    className
                )}
                role="separator"
                aria-label={label}
            >
                <div
                    className={classNames(
                        'divider',
                        `divider--${orientation}`,
                        `divider--${variant}`,
                        `divider--${color}`
                    )}
                />
                <span className="divider__label">{label}</span>
                <div
                    className={classNames(
                        'divider',
                        `divider--${orientation}`,
                        `divider--${variant}`,
                        `divider--${color}`
                    )}
                />
            </div>
        )
    }

    return (
        <div
            className={classNames(
                'divider-wrapper',
                `divider-wrapper--${orientation}`,
                `divider-wrapper--${spacing}`,
                className
            )}
            role="separator"
        >
            <div
                className={classNames(
                    'divider',
                    `divider--${orientation}`,
                    `divider--${variant}`,
                    `divider--${color}`
                )}
            />
        </div>
    )
}

export default Divider
