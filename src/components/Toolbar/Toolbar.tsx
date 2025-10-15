import React from 'react'
import { classNames } from '../../utility/classnames'
import './toolbar.scss'

export type ToolbarVariant = 'default' | 'elevated' | 'filled'
export type ToolbarSize = 'sm' | 'md' | 'lg'

export interface ToolbarProps {
    /** Toolbar content (buttons, icons, text, etc.) */
    children: React.ReactNode
    /** Visual variant */
    variant?: ToolbarVariant
    /** Size variant */
    size?: ToolbarSize
    /** Position toolbar at top or bottom */
    position?: 'top' | 'bottom' | 'static'
    /** Additional CSS class */
    className?: string
    /** Left-aligned content */
    leftContent?: React.ReactNode
    /** Center-aligned content */
    centerContent?: React.ReactNode
    /** Right-aligned content */
    rightContent?: React.ReactNode
    /** ARIA label for accessibility */
    ariaLabel?: string
}

const Toolbar: React.FC<ToolbarProps> = ({
    children,
    variant = 'default',
    size = 'md',
    position = 'static',
    className,
    leftContent,
    centerContent,
    rightContent,
    ariaLabel = 'Toolbar',
}) => {
    const toolbarClasses = classNames(
        'toolbar',
        `toolbar--${variant}`,
        `toolbar--${size}`,
        `toolbar--${position}`,
        className
    )

    // If using section-based layout
    if (leftContent || centerContent || rightContent) {
        return (
            <div
                className={toolbarClasses}
                role="toolbar"
                aria-label={ariaLabel}
            >
                {leftContent && (
                    <div className="toolbar__section toolbar__section--left">
                        {leftContent}
                    </div>
                )}
                {centerContent && (
                    <div className="toolbar__section toolbar__section--center">
                        {centerContent}
                    </div>
                )}
                {rightContent && (
                    <div className="toolbar__section toolbar__section--right">
                        {rightContent}
                    </div>
                )}
            </div>
        )
    }

    // Simple layout with just children
    return (
        <div className={toolbarClasses} role="toolbar" aria-label={ariaLabel}>
            {children}
        </div>
    )
}

Toolbar.displayName = 'Toolbar'

export default Toolbar
