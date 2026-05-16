import React, { forwardRef } from 'react'
import { classNames } from '../../utility/classnames'
import './AspectRatio.scss'

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The width-to-height ratio (e.g. 16/9, 4/3, 1) */
    ratio?: number
    /** Custom className */
    className?: string
}

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
    ({ ratio = 16 / 9, className, children, style, ...rest }, ref) => {
        return (
            <div
                ref={ref}
                className={classNames('aspect-ratio', className)}
                style={
                    {
                        ...style,
                        '--aspect-ratio-padding': `${(1 / ratio) * 100}%`,
                    } as React.CSSProperties
                }
                {...rest}
            >
                <div className="aspect-ratio__inner">{children}</div>
            </div>
        )
    }
)

AspectRatio.displayName = 'AspectRatio'
export default AspectRatio
