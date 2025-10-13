import React, { CSSProperties } from 'react'
import {
    useResize,
    ResizeOptions,
    ResizeDirection,
} from '../../utility/hooks/useResize'
import { classNames } from '../../utility/classnames'
import './Resizable.scss'

export type ResizableHandle =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'

export type ResizableProps = {
    children: React.ReactNode
    /**
     * Initial or controlled width in pixels
     */
    width?: number
    /**
     * Initial or controlled height in pixels
     */
    height?: number
    /**
     * Minimum width in pixels
     * @default 50
     */
    minWidth?: number
    /**
     * Minimum height in pixels
     * @default 50
     */
    minHeight?: number
    /**
     * Maximum width in pixels
     * @default Infinity
     */
    maxWidth?: number
    /**
     * Maximum height in pixels
     * @default Infinity
     */
    maxHeight?: number
    /**
     * Snap resize to step increments
     * @default 1
     */
    step?: number
    /**
     * Which resize handles to show
     * @default ['top', 'right', 'bottom', 'left', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']
     */
    handles?: ResizableHandle[]
    /**
     * Additional className for the wrapper
     */
    className?: string
    /**
     * Additional styles for the wrapper
     */
    style?: CSSProperties
    /**
     * Callback fired during resize
     */
    onResize?: (size: { width: number; height: number }) => void
    /**
     * Callback fired when resize starts
     */
    onResizeStart?: (size: { width: number; height: number }) => void
    /**
     * Callback fired when resize ends
     */
    onResizeEnd?: (size: { width: number; height: number }) => void
    /**
     * Whether to preserve aspect ratio during resize
     * @default false
     */
    preserveAspectRatio?: boolean
    /**
     * Whether to show resize handles only on hover
     * @default false
     */
    showHandlesOnHover?: boolean
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean
}

const DEFAULT_HANDLES: ResizableHandle[] = [
    'top',
    'right',
    'bottom',
    'left',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
]

export const Resizable: React.FC<ResizableProps> = ({
    children,
    width,
    height,
    minWidth = 50,
    minHeight = 50,
    maxWidth = Infinity,
    maxHeight = Infinity,
    step = 1,
    handles = DEFAULT_HANDLES,
    className,
    style,
    onResize,
    onResizeStart,
    onResizeEnd,
    preserveAspectRatio = false,
    showHandlesOnHover = false,
    disabled = false,
}) => {
    const ref = React.useRef<HTMLDivElement>(null)

    const resizeOptions: ResizeOptions = {
        step,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        onResize,
        onResizeStart,
        onResizeEnd,
        preserveAspectRatio,
    }

    const { isResizing, createResizeHandler, getCursor } = useResize(
        ref,
        resizeOptions
    )

    const wrapperClassName = classNames('resizable', className, {
        'resizable--resizing': isResizing,
        'resizable--hover-handles': showHandlesOnHover,
        'resizable--disabled': disabled,
    })

    const wrapperStyle: CSSProperties = {
        ...style,
        width: width ? `${width}px` : style?.width,
        height: height ? `${height}px` : style?.height,
    }

    const renderHandle = (direction: ResizeDirection) => {
        if (!handles.includes(direction as ResizableHandle) || disabled) {
            return null
        }

        const handleClassName = classNames(
            'resizable__handle',
            `resizable__handle--${direction}`
        )

        return (
            <div
                key={direction}
                className={handleClassName}
                onPointerDown={createResizeHandler(direction)}
                style={{ cursor: getCursor(direction) }}
                role="separator"
                aria-label={`Resize ${direction}`}
                aria-orientation={
                    direction === 'top' || direction === 'bottom'
                        ? 'horizontal'
                        : 'vertical'
                }
                tabIndex={0}
            />
        )
    }

    return (
        <div ref={ref} className={wrapperClassName} style={wrapperStyle}>
            <div className="resizable__content">{children}</div>
            {renderHandle('top')}
            {renderHandle('right')}
            {renderHandle('bottom')}
            {renderHandle('left')}
            {renderHandle('topLeft')}
            {renderHandle('topRight')}
            {renderHandle('bottomLeft')}
            {renderHandle('bottomRight')}
        </div>
    )
}

export default Resizable
