import React, { FC } from 'react'
import { useResize, ResizeOptions } from '../../utility/hooks/useResize'

export type ResizableComponentProps = { options: ResizeOptions }

const ResizableComponent: FC<ResizableComponentProps> = ({
    children,
    options,
}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const { initResize, size, cursor } = useResize(ref, options)

    return (
        <div
            style={{
                backgroundColor: 'pink',
                padding: '20px',
                position: 'relative',
            }}
            ref={ref}
        >
            {children}
            <div
                style={{
                    borderBottom: '0 solid transparent',
                    borderRight: '15px solid black',
                    borderTop: '15px solid transparent',
                    bottom: 0,
                    cursor: cursor,
                    display: 'inline-block',
                    height: 0,
                    position: 'absolute',
                    right: 0,
                    width: 0,
                }}
                onMouseDown={initResize}
            />
        </div>
    )
}

export default ResizableComponent