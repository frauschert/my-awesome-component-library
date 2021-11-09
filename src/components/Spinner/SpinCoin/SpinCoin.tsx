import React from 'react'
import { classNames } from '../../../utility/classnames'
import hex from '../../../utility/hex'
import { SpinnerProps } from '../types'
import './spin-coin.css'

const defaultColor = hex('#7f58af')

export default function SpinCoin({
    color = defaultColor,
    size = 64,
    className,
}: SpinnerProps) {
    return (
        <div
            className={classNames('spin-coin', className)}
            style={{ background: color, width: size, height: size }}
        />
    )
}
