import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultProps } from '../utils'
import './spin-coin.css'

export default function SpinCoin({
    color = defaultProps.color,
    size = defaultProps.size,
    className,
}: SpinnerProps) {
    return (
        <div
            className={classNames('spin-coin', className)}
            style={{ background: color, width: size, height: size }}
        />
    )
}
