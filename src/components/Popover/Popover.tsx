import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { classNames } from '../../utility/classnames'
import './Popover.scss'

export type PopoverPlacement =
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

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

export interface PopoverProps {
    /**
     * Content to display in the popover
     */
    content: React.ReactNode
    /**
     * Element that triggers the popover
     */
    children: React.ReactNode
    /**
     * Placement of the popover relative to trigger
     */
    placement?: PopoverPlacement
    /**
     * How the popover is triggered
     */
    trigger?: PopoverTrigger
    /**
     * Whether the popover is open (controlled)
     */
    open?: boolean
    /**
     * Default open state (uncontrolled)
     */
    defaultOpen?: boolean
    /**
     * Called when open state changes
     */
    onOpenChange?: (open: boolean) => void
    /**
     * Show arrow pointing to trigger
     */
    showArrow?: boolean
    /**
     * Offset from the trigger element (pixels)
     */
    offset?: number
    /**
     * Close on click outside
     */
    closeOnClickOutside?: boolean
    /**
     * Close on escape key
     */
    closeOnEscape?: boolean
    /**
     * Custom className for popover content
     */
    className?: string
    /**
     * Delay before showing (ms)
     */
    mouseEnterDelay?: number
    /**
     * Delay before hiding (ms)
     */
    mouseLeaveDelay?: number
    /**
     * Disable the popover
     */
    disabled?: boolean
    /**
     * Z-index of the popover
     */
    zIndex?: number
}

interface Position {
    top: number
    left: number
}

function Popover({
    content,
    children,
    placement = 'bottom',
    trigger = 'click',
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    showArrow = true,
    offset = 8,
    closeOnClickOutside = true,
    closeOnEscape = true,
    className,
    mouseEnterDelay = 100,
    mouseLeaveDelay = 100,
    disabled = false,
    zIndex = 1000,
}: PopoverProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen

    const triggerRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const enterTimerRef = useRef<NodeJS.Timeout | null>(null)
    const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

    const setOpen = useCallback(
        (open: boolean) => {
            if (disabled) return

            if (!isControlled) {
                setInternalOpen(open)
            }
            onOpenChange?.(open)
        },
        [disabled, isControlled, onOpenChange]
    )

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current || !popoverRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const popoverRect = popoverRef.current.getBoundingClientRect()
        const scrollX = window.scrollX
        const scrollY = window.scrollY

        let top = 0
        let left = 0

        // Calculate base position
        switch (placement) {
            case 'top':
                top = triggerRect.top + scrollY - popoverRect.height - offset
                left =
                    triggerRect.left +
                    scrollX +
                    triggerRect.width / 2 -
                    popoverRect.width / 2
                break
            case 'top-start':
                top = triggerRect.top + scrollY - popoverRect.height - offset
                left = triggerRect.left + scrollX
                break
            case 'top-end':
                top = triggerRect.top + scrollY - popoverRect.height - offset
                left = triggerRect.right + scrollX - popoverRect.width
                break
            case 'bottom':
                top = triggerRect.bottom + scrollY + offset
                left =
                    triggerRect.left +
                    scrollX +
                    triggerRect.width / 2 -
                    popoverRect.width / 2
                break
            case 'bottom-start':
                top = triggerRect.bottom + scrollY + offset
                left = triggerRect.left + scrollX
                break
            case 'bottom-end':
                top = triggerRect.bottom + scrollY + offset
                left = triggerRect.right + scrollX - popoverRect.width
                break
            case 'left':
                top =
                    triggerRect.top +
                    scrollY +
                    triggerRect.height / 2 -
                    popoverRect.height / 2
                left = triggerRect.left + scrollX - popoverRect.width - offset
                break
            case 'left-start':
                top = triggerRect.top + scrollY
                left = triggerRect.left + scrollX - popoverRect.width - offset
                break
            case 'left-end':
                top = triggerRect.bottom + scrollY - popoverRect.height
                left = triggerRect.left + scrollX - popoverRect.width - offset
                break
            case 'right':
                top =
                    triggerRect.top +
                    scrollY +
                    triggerRect.height / 2 -
                    popoverRect.height / 2
                left = triggerRect.right + scrollX + offset
                break
            case 'right-start':
                top = triggerRect.top + scrollY
                left = triggerRect.right + scrollX + offset
                break
            case 'right-end':
                top = triggerRect.bottom + scrollY - popoverRect.height
                left = triggerRect.right + scrollX + offset
                break
        }

        // Keep within viewport bounds
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left + popoverRect.width > viewportWidth + scrollX) {
            left = viewportWidth + scrollX - popoverRect.width - 8
        }
        if (left < scrollX) {
            left = scrollX + 8
        }
        if (top + popoverRect.height > viewportHeight + scrollY) {
            top = viewportHeight + scrollY - popoverRect.height - 8
        }
        if (top < scrollY) {
            top = scrollY + 8
        }

        setPosition({ top, left })
    }, [placement, offset])

    // Update position when open or window resizes
    useEffect(() => {
        if (!isOpen) return

        calculatePosition()

        const handleResize = () => calculatePosition()
        const handleScroll = () => calculatePosition()

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll, true)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [isOpen, calculatePosition])

    // Handle click outside
    useEffect(() => {
        if (!isOpen || !closeOnClickOutside || trigger === 'hover') return

        const handleClickOutside = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                popoverRef.current?.contains(e.target as Node)
            ) {
                return
            }
            setOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, closeOnClickOutside, trigger, setOpen])

    // Handle escape key
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, setOpen])

    const clearTimers = () => {
        if (enterTimerRef.current) {
            clearTimeout(enterTimerRef.current)
            enterTimerRef.current = null
        }
        if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current)
            leaveTimerRef.current = null
        }
    }

    const handleMouseEnter = () => {
        if (trigger !== 'hover' || disabled) return
        clearTimers()
        enterTimerRef.current = setTimeout(() => {
            setOpen(true)
        }, mouseEnterDelay)
    }

    const handleMouseLeave = () => {
        if (trigger !== 'hover' || disabled) return
        clearTimers()
        leaveTimerRef.current = setTimeout(() => {
            setOpen(false)
        }, mouseLeaveDelay)
    }

    const handleClick = () => {
        if (trigger !== 'click' || disabled) return
        setOpen(!isOpen)
    }

    const handleFocus = () => {
        if (trigger !== 'focus' || disabled) return
        setOpen(true)
    }

    const handleBlur = () => {
        if (trigger !== 'focus' || disabled) return
        setOpen(false)
    }

    const triggerProps: React.HTMLAttributes<HTMLDivElement> = {
        className: 'popover__trigger',
    }

    if (trigger === 'click') {
        triggerProps.onClick = handleClick
    }
    if (trigger === 'hover') {
        triggerProps.onMouseEnter = handleMouseEnter
        triggerProps.onMouseLeave = handleMouseLeave
    }
    if (trigger === 'focus') {
        triggerProps.onFocus = handleFocus
        triggerProps.onBlur = handleBlur
    }

    const popoverContent = isOpen && (
        <div
            ref={popoverRef}
            className={classNames('popover', className, {
                'popover--visible': isOpen,
            })}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex,
                visibility:
                    position.top === 0 && position.left === 0
                        ? 'hidden'
                        : 'visible',
            }}
            onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
            onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
            role="dialog"
            aria-modal="false"
        >
            {showArrow && (
                <div
                    className={classNames('popover__arrow', {
                        [`popover__arrow--${placement}`]: true,
                    })}
                />
            )}
            <div className="popover__content">{content}</div>
        </div>
    )

    return (
        <>
            <div ref={triggerRef} {...triggerProps}>
                {children}
            </div>
            {popoverContent &&
                ReactDOM.createPortal(popoverContent, document.body)}
        </>
    )
}

export default Popover
