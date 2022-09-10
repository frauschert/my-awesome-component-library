import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultSpinnerProps } from '../utils'
import './spin-coin.css'

export default function SpinCoin({
    color = defaultSpinnerProps.color,
    size = defaultSpinnerProps.size,
    className,
}: SpinnerProps) {
    return (
        <div
            role="spinner"
            className={classNames('spin-coin', className)}
            style={{ background: color, width: size, height: size }}
        />
    )
}
