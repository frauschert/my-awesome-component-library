import React from 'react'
import { classNames } from '../../../utility/classnames'
import hex from '../../../utility/hex'
import { SpinnerProps } from '../types'
import './spin-coin.css'

export const defaultProps = {
    color: hex('#7f58af'),
    size: 64,
}

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
