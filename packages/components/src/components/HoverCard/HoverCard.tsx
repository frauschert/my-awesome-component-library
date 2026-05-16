import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { classNames } from '../../utility/classnames'
import './HoverCard.scss'

export type HoverCardPlacement =
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

export interface HoverCardProps {
    /** Rich content to display inside the card */
    content: React.ReactNode
    /** Element that triggers the hover card */
    children: React.ReactNode
    /** Placement of the card relative to the trigger */
    placement?: HoverCardPlacement
    /** Whether the card is open (controlled) */
    open?: boolean
    /** Default open state (uncontrolled) */
    defaultOpen?: boolean
    /** Called when open state changes */
    onOpenChange?: (open: boolean) => void
    /** Delay before opening the card (ms) */
    openDelay?: number
    /** Delay before closing the card (ms) */
    closeDelay?: number
    /** Offset from the trigger element in pixels */
    offset?: number
    /** Show arrow pointing to the trigger */
    showArrow?: boolean
    /** Additional CSS class for the card */
    className?: string
    /** Disable the hover card */
    disabled?: boolean
    /** Z-index of the card */
    zIndex?: number
}

interface Position {
    top: number
    left: number
}

function HoverCard({
    content,
    children,
    placement = 'bottom',
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    openDelay = 300,
    closeDelay = 200,
    offset = 8,
    showArrow = true,
    className,
    disabled = false,
    zIndex = 1050,
}: HoverCardProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen

    const triggerRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const openTimerRef = useRef<NodeJS.Timeout | null>(null)
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
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

    const clearTimers = useCallback(() => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current)
            openTimerRef.current = null
        }
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
    }, [])

    const handleTriggerMouseEnter = useCallback(() => {
        if (disabled) return
        clearTimers()
        openTimerRef.current = setTimeout(() => {
            setOpen(true)
        }, openDelay)
    }, [disabled, clearTimers, setOpen, openDelay])

    const handleTriggerMouseLeave = useCallback(() => {
        if (disabled) return
        clearTimers()
        closeTimerRef.current = setTimeout(() => {
            setOpen(false)
        }, closeDelay)
    }, [disabled, clearTimers, setOpen, closeDelay])

    // Hover bridge: cancel close when cursor enters the card
    const handleCardMouseEnter = useCallback(() => {
        clearTimers()
    }, [clearTimers])

    const handleCardMouseLeave = useCallback(() => {
        closeTimerRef.current = setTimeout(() => {
            setOpen(false)
        }, closeDelay)
    }, [setOpen, closeDelay])

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current || !cardRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const cardRect = cardRef.current.getBoundingClientRect()
        const scrollX = window.scrollX
        const scrollY = window.scrollY

        let top = 0
        let left = 0

        switch (placement) {
            case 'top':
                top = triggerRect.top + scrollY - cardRect.height - offset
                left =
                    triggerRect.left +
                    scrollX +
                    triggerRect.width / 2 -
                    cardRect.width / 2
                break
            case 'top-start':
                top = triggerRect.top + scrollY - cardRect.height - offset
                left = triggerRect.left + scrollX
                break
            case 'top-end':
                top = triggerRect.top + scrollY - cardRect.height - offset
                left = triggerRect.right + scrollX - cardRect.width
                break
            case 'bottom':
                top = triggerRect.bottom + scrollY + offset
                left =
                    triggerRect.left +
                    scrollX +
                    triggerRect.width / 2 -
                    cardRect.width / 2
                break
            case 'bottom-start':
                top = triggerRect.bottom + scrollY + offset
                left = triggerRect.left + scrollX
                break
            case 'bottom-end':
                top = triggerRect.bottom + scrollY + offset
                left = triggerRect.right + scrollX - cardRect.width
                break
            case 'left':
                top =
                    triggerRect.top +
                    scrollY +
                    triggerRect.height / 2 -
                    cardRect.height / 2
                left = triggerRect.left + scrollX - cardRect.width - offset
                break
            case 'left-start':
                top = triggerRect.top + scrollY
                left = triggerRect.left + scrollX - cardRect.width - offset
                break
            case 'left-end':
                top = triggerRect.bottom + scrollY - cardRect.height
                left = triggerRect.left + scrollX - cardRect.width - offset
                break
            case 'right':
                top =
                    triggerRect.top +
                    scrollY +
                    triggerRect.height / 2 -
                    cardRect.height / 2
                left = triggerRect.right + scrollX + offset
                break
            case 'right-start':
                top = triggerRect.top + scrollY
                left = triggerRect.right + scrollX + offset
                break
            case 'right-end':
                top = triggerRect.bottom + scrollY - cardRect.height
                left = triggerRect.right + scrollX + offset
                break
        }

        // Keep within viewport bounds
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left + cardRect.width > viewportWidth + scrollX) {
            left = viewportWidth + scrollX - cardRect.width - 8
        }
        if (left < scrollX) {
            left = scrollX + 8
        }
        if (top + cardRect.height > viewportHeight + scrollY) {
            top = viewportHeight + scrollY - cardRect.height - 8
        }
        if (top < scrollY) {
            top = scrollY + 8
        }

        setPosition({ top, left })
    }, [placement, offset])

    // Recalculate position when open
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

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, setOpen])

    // Cleanup timers on unmount
    useEffect(() => {
        return () => clearTimers()
    }, [clearTimers])

    const cardContent = isOpen && (
        <div
            ref={cardRef}
            className={classNames('hover-card', className, {
                'hover-card--visible': isOpen,
                [`hover-card--${placement}`]: true,
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
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            role="dialog"
            aria-modal="false"
        >
            {showArrow && (
                <div
                    className={classNames('hover-card__arrow', {
                        [`hover-card__arrow--${placement}`]: true,
                    })}
                />
            )}
            <div className="hover-card__content">{content}</div>
        </div>
    )

    return (
        <>
            <div
                ref={triggerRef}
                className="hover-card__trigger"
                onMouseEnter={handleTriggerMouseEnter}
                onMouseLeave={handleTriggerMouseLeave}
                aria-haspopup="dialog"
            >
                {children}
            </div>
            {cardContent && ReactDOM.createPortal(cardContent, document.body)}
        </>
    )
}

HoverCard.displayName = 'HoverCard'

export default HoverCard
