import React, { useState, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './tooltip.scss'

export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

export interface TooltipProps {
    /** Content to show in the tooltip */
    content: React.ReactNode
    /** Element that triggers the tooltip */
    children: React.ReactElement
    /** Placement of the tooltip relative to the trigger */
    placement?: TooltipPlacement
    /** How the tooltip is triggered */
    trigger?: TooltipTrigger | TooltipTrigger[]
    /** Delay before showing (ms) */
    showDelay?: number
    /** Delay before hiding (ms) */
    hideDelay?: number
    /** Whether tooltip is disabled */
    disabled?: boolean
    /** Additional CSS class for tooltip */
    className?: string
    /** Maximum width of tooltip */
    maxWidth?: number | string
    /** Show arrow pointing to trigger */
    showArrow?: boolean
    /** Controlled visibility */
    visible?: boolean
    /** Callback when visibility changes */
    onVisibleChange?: (visible: boolean) => void
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    placement = 'top',
    trigger = 'hover',
    showDelay = 200,
    hideDelay = 0,
    disabled = false,
    className,
    maxWidth = 250,
    showArrow = true,
    visible: controlledVisible,
    onVisibleChange,
}) => {
    const [internalVisible, setInternalVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const showTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const isControlled = controlledVisible !== undefined
    const visible = isControlled ? controlledVisible : internalVisible

    const triggers = Array.isArray(trigger) ? trigger : [trigger]

    const setVisible = (newVisible: boolean) => {
        if (disabled) return

        if (!isControlled) {
            setInternalVisible(newVisible)
        }
        onVisibleChange?.(newVisible)
    }

    const handleShow = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
        }
        showTimeoutRef.current = setTimeout(() => {
            setVisible(true)
        }, showDelay)
    }

    const handleHide = () => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current)
        }
        hideTimeoutRef.current = setTimeout(() => {
            setVisible(false)
        }, hideDelay)
    }

    const handleToggle = () => {
        if (visible) {
            handleHide()
        } else {
            handleShow()
        }
    }

    // Calculate position
    useEffect(() => {
        if (!visible || !triggerRef.current || !tooltipRef.current) return

        const updatePosition = () => {
            if (!triggerRef.current || !tooltipRef.current) return

            const triggerRect = triggerRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const gap = 8 // Gap between trigger and tooltip

            let top = 0
            let left = 0

            // Calculate base position
            switch (placement) {
                case 'top':
                case 'top-start':
                case 'top-end':
                    top = triggerRect.top - tooltipRect.height - gap
                    left = triggerRect.left + triggerRect.width / 2
                    if (placement === 'top-start') {
                        left = triggerRect.left
                    } else if (placement === 'top-end') {
                        left = triggerRect.right
                    }
                    break

                case 'bottom':
                case 'bottom-start':
                case 'bottom-end':
                    top = triggerRect.bottom + gap
                    left = triggerRect.left + triggerRect.width / 2
                    if (placement === 'bottom-start') {
                        left = triggerRect.left
                    } else if (placement === 'bottom-end') {
                        left = triggerRect.right
                    }
                    break

                case 'left':
                case 'left-start':
                case 'left-end':
                    top = triggerRect.top + triggerRect.height / 2
                    left = triggerRect.left - tooltipRect.width - gap
                    if (placement === 'left-start') {
                        top = triggerRect.top
                    } else if (placement === 'left-end') {
                        top = triggerRect.bottom
                    }
                    break

                case 'right':
                case 'right-start':
                case 'right-end':
                    top = triggerRect.top + triggerRect.height / 2
                    left = triggerRect.right + gap
                    if (placement === 'right-start') {
                        top = triggerRect.top
                    } else if (placement === 'right-end') {
                        top = triggerRect.bottom
                    }
                    break
            }

            // Adjust for center alignment
            if (placement.startsWith('top') || placement.startsWith('bottom')) {
                if (placement.endsWith('end')) {
                    left -= tooltipRect.width
                } else if (!placement.includes('-')) {
                    left -= tooltipRect.width / 2
                }
            } else {
                if (placement.endsWith('end')) {
                    top -= tooltipRect.height
                } else if (!placement.includes('-')) {
                    top -= tooltipRect.height / 2
                }
            }

            // Keep within viewport
            const padding = 8
            if (left < padding) {
                left = padding
            } else if (left + tooltipRect.width > window.innerWidth - padding) {
                left = window.innerWidth - tooltipRect.width - padding
            }

            if (top < padding) {
                top = padding
            } else if (
                top + tooltipRect.height >
                window.innerHeight - padding
            ) {
                top = window.innerHeight - tooltipRect.height - padding
            }

            setPosition({ top, left })
        }

        updatePosition()
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [visible, placement])

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    // Clone child and add event handlers
    const childProps: Record<string, unknown> = {}

    if (triggers.includes('hover')) {
        childProps.onMouseEnter = (e: React.MouseEvent) => {
            handleShow()
            const originalHandler = (children.props as Record<string, unknown>)
                .onMouseEnter
            if (typeof originalHandler === 'function') {
                originalHandler(e)
            }
        }
        childProps.onMouseLeave = (e: React.MouseEvent) => {
            handleHide()
            const originalHandler = (children.props as Record<string, unknown>)
                .onMouseLeave
            if (typeof originalHandler === 'function') {
                originalHandler(e)
            }
        }
    }

    if (triggers.includes('click')) {
        childProps.onClick = (e: React.MouseEvent) => {
            handleToggle()
            const originalHandler = (children.props as Record<string, unknown>)
                .onClick
            if (typeof originalHandler === 'function') {
                originalHandler(e)
            }
        }
    }

    if (triggers.includes('focus')) {
        childProps.onFocus = (e: React.FocusEvent) => {
            handleShow()
            const originalHandler = (children.props as Record<string, unknown>)
                .onFocus
            if (typeof originalHandler === 'function') {
                originalHandler(e)
            }
        }
        childProps.onBlur = (e: React.FocusEvent) => {
            handleHide()
            const originalHandler = (children.props as Record<string, unknown>)
                .onBlur
            if (typeof originalHandler === 'function') {
                originalHandler(e)
            }
        }
    }

    childProps.ref = (node: HTMLElement) => {
        triggerRef.current = node
        // Handle child's ref if it exists
        const childRef = (children as React.ReactElement & { ref?: unknown })
            .ref
        if (typeof childRef === 'function') {
            childRef(node)
        } else if (
            childRef &&
            typeof childRef === 'object' &&
            'current' in childRef
        ) {
            ;(childRef as React.MutableRefObject<HTMLElement>).current = node
        }
    }

    const tooltipClasses = classNames(
        'tooltip',
        `tooltip--${placement}`,
        { 'tooltip--visible': visible, 'tooltip--arrow': showArrow },
        className
    )

    return (
        <>
            {React.cloneElement(children, childProps)}
            {visible && (
                <div
                    ref={tooltipRef}
                    className={tooltipClasses}
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        maxWidth:
                            typeof maxWidth === 'number'
                                ? `${maxWidth}px`
                                : maxWidth,
                    }}
                    role="tooltip"
                >
                    {showArrow && <div className="tooltip__arrow" />}
                    <div className="tooltip__content">{content}</div>
                </div>
            )}
        </>
    )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
