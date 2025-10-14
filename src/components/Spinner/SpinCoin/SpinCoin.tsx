import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultSpinnerProps, getSpinnerSize, getSpinnerColor } from '../utils'
import './spin-coin.css'

/**
 * SpinCoin - A spinning circular loading indicator
 *
 * @example
 * ```tsx
 * <SpinCoin label="Loading data" size="lg" variant="primary" />
 * <SpinCoin size={48} color={hex('#3b82f6')} speed={1.5} />
 * ```
 */
function SpinCoin(props: SpinnerProps) {
    const {
        color,
        variant,
        size = defaultSpinnerProps.size,
        speed = defaultSpinnerProps.speed,
        className,
        label = 'Loading',
    } = props

    const sizeInPx = getSpinnerSize(size)
    const spinnerColor = getSpinnerColor(color, variant)
    const animationDuration = `${2.4 / speed}s`

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className={classNames('spin-coin', className)}
            style={{
                background: spinnerColor,
                width: `${sizeInPx}px`,
                height: `${sizeInPx}px`,
                animationDuration,
            }}
        >
            <span className="sr-only">{label}</span>
        </div>
    )
}

export default React.memo(SpinCoin)
