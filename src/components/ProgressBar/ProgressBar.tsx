import React from 'react'
import { classNames } from '../../utility/classnames'
import './ProgressBar.scss'

export interface ProgressBarProps {
    /** Progress value (0-100) */
    value: number
    /** Maximum value (default: 100) */
    max?: number
    /** Visual variant */
    variant?: 'default' | 'striped' | 'animated'
    /** Color scheme */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
    /** Size variant */
    size?: 'small' | 'medium' | 'large'
    /** Label to display inside the bar */
    label?: string
    /** Whether to show percentage */
    showPercentage?: boolean
    /** Custom label position */
    labelPosition?: 'inside' | 'outside' | 'none'
    /** Whether the bar is indeterminate (loading state) */
    indeterminate?: boolean
    /** Custom className */
    className?: string
    /** Accessible label */
    'aria-label'?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    variant = 'default',
    color = 'primary',
    size = 'medium',
    label,
    showPercentage = false,
    labelPosition = 'inside',
    indeterminate = false,
    className,
    'aria-label': ariaLabel,
}) => {
    const percentage = indeterminate
        ? 100
        : Math.min(100, Math.max(0, (value / max) * 100))
    const displayLabel =
        label || (showPercentage ? `${Math.round(percentage)}%` : '')

    const shouldShowInsideLabel =
        labelPosition === 'inside' && displayLabel && !indeterminate
    const shouldShowOutsideLabel =
        labelPosition === 'outside' && displayLabel && !indeterminate

    return (
        <div
            className={classNames(
                'progressbar',
                `progressbar--${size}`,
                {
                    'progressbar--indeterminate': indeterminate,
                    'progressbar--has-outside-label': !!shouldShowOutsideLabel,
                },
                className
            )}
        >
            <div
                className={classNames(
                    'progressbar__track',
                    `progressbar__track--${color}`
                )}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : value}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={
                    ariaLabel ||
                    (indeterminate ? 'Loading' : `${Math.round(percentage)}%`)
                }
            >
                <div
                    className={classNames(
                        'progressbar__fill',
                        `progressbar__fill--${variant}`,
                        {
                            'progressbar__fill--indeterminate': indeterminate,
                        }
                    )}
                    style={
                        indeterminate ? undefined : { width: `${percentage}%` }
                    }
                >
                    {shouldShowInsideLabel && (
                        <span className="progressbar__label">
                            {displayLabel}
                        </span>
                    )}
                </div>
            </div>
            {shouldShowOutsideLabel && (
                <span className="progressbar__label-outside">
                    {displayLabel}
                </span>
            )}
        </div>
    )
}

export default ProgressBar
