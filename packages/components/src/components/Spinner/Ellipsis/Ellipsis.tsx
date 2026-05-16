import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultSpinnerProps, getSpinnerSize, getSpinnerColor } from '../utils'
import './ellipsis.scss'

/**
 * Ellipsis - An animated ellipsis loading indicator with bouncing dots
 *
 * @example
 * ```tsx
 * <Ellipsis label="Processing request" size="lg" variant="success" />
 * <Ellipsis size={64} color={hex('#10b981')} speed={0.8} />
 * ```
 */
function Ellipsis(props: SpinnerProps) {
    const {
        size = defaultSpinnerProps.size,
        color,
        variant,
        speed = defaultSpinnerProps.speed,
        className,
        label = 'Loading',
    } = props

    const sizeInPx = getSpinnerSize(size)
    const spinnerColor = getSpinnerColor(color, variant)
    const animationDuration = `${0.6 / speed}s`

    const circles = [...Array(4)].map((_, index) => (
        <div
            key={index}
            style={{
                background: spinnerColor,
                animationDuration,
            }}
        />
    ))

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className={classNames('ellipsis', className)}
            style={{ width: `${sizeInPx}px`, height: `${sizeInPx}px` }}
        >
            {circles}
            <span className="sr-only">{label}</span>
        </div>
    )
}

export default React.memo(Ellipsis)
