import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultProps } from '../utils'
import './ellipsis.css'

export default function Ellipsis({
    color = defaultProps.color,
    size = defaultProps.size,
    className,
}: SpinnerProps) {
    const circles = [...Array(4)].map((_, index) => (
        <div key={index} style={{ background: color }} />
    ))

    return (
        <div
            className={classNames('ellipsis', className)}
            style={{ width: size, height: size }}
        >
            {circles}
        </div>
    )
}
