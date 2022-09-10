import React from 'react'
import { classNames } from '../../../utility/classnames'
import { SpinnerProps } from '../types'
import { defaultSpinnerProps } from '../utils'
import './ellipsis.css'

export default function Ellipsis(props: SpinnerProps) {
    const { size, color, className } = {
        ...defaultSpinnerProps,
        ...props,
    }
    const circles = [...Array(4)].map((_, index) => (
        <div key={index} style={{ background: color }} />
    ))

    return (
        <div
            role="spinner"
            className={classNames('ellipsis', className)}
            style={{ width: size, height: size }}
        >
            {circles}
        </div>
    )
}
