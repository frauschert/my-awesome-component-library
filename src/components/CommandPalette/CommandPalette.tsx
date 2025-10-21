import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './command-palette.scss'
import { classNames } from '../../utility/classnames'

export interface CommandItem {
    id: string
    title: string
    description?: string
    icon?: React.ReactNode
    shortcut?: string
    group?: string
    onSelect?: () => void
}

export interface CommandPaletteProps {
    commands: CommandItem[]
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    placeholder?: string
    maxResults?: number
    shortcut?: string // display text like 'Ctrl+K'
    ariaLabel?: string
    emptyStateMessage?: string
    showRecentCommands?: boolean
    maxRecentCommands?: number
}

const DEFAULT_MAX = 10

function useShortcut(key: string, handler: (e: KeyboardEvent) => void) {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            const isMac =
                typeof window !== 'undefined' &&
                window.navigator.platform.toUpperCase().indexOf('MAC') >= 0
            const ctrl = isMac ? e.metaKey : e.ctrlKey
            if (
                (ctrl && e.key.toLowerCase() === key.toLowerCase()) ||
                e.key.toLowerCase() === key.toLowerCase()
            ) {
                handler(e)
            }
        }
        window.addEventListener('keydown', fn)
        return () => window.removeEventListener('keydown', fn)
    }, [key, handler])
}

function fuzzyMatch(term: string, text: string) {
    if (!term) return true
    term = term.toLowerCase()
    text = text.toLowerCase()
    let i = 0
    for (const ch of text) {
        if (ch === term[i]) {
            i++
            if (i === term.length) return true
        }
    }
    return false
}

const CommandPalette = ({
    commands,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    placeholder = 'Search commands...',
    maxResults = DEFAULT_MAX,
    shortcut = 'Ctrl+K',
    ariaLabel = 'Command Palette',
    emptyStateMessage = 'No commands found',
    showRecentCommands = true,
    maxRecentCommands = 5,
}: CommandPaletteProps) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? (controlledOpen as boolean) : internalOpen

    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const [recentCommandIds, setRecentCommandIds] = useState<string[]>([])

    const inputRef = useRef<HTMLInputElement | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map())

    const setOpen = useCallback(
        (open: boolean) => {
            if (!isControlled) setInternalOpen(open)
            onOpenChange?.(open)
        },
        [isControlled, onOpenChange]
    )

    useShortcut('k', (e) => {
        // don't open when typing in inputs
        const tag = (e.target as HTMLElement).tagName
        if (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            (e.target as HTMLElement).isContentEditable
        )
            return
        e.preventDefault()
        setOpen(true)
    })

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0)
        } else {
            setQuery('')
            setActiveIndex(0)
        }
    }, [isOpen])

    const filtered = useMemo(() => {
        // When no query and recent commands enabled, show recent commands first
        if (!query && showRecentCommands && recentCommandIds.length > 0) {
            const recentCommands = recentCommandIds
                .map((id) => commands.find((c) => c.id === id))
                .filter((c): c is CommandItem => c !== undefined)
                .slice(0, maxRecentCommands)

            // Add remaining commands that aren't recent
            const recentIds = new Set(recentCommands.map((c) => c.id))
            const otherCommands = commands
                .filter((c) => !recentIds.has(c.id))
                .slice(0, maxResults - recentCommands.length)

            return [...recentCommands, ...otherCommands]
        }

        const matches = commands
            .filter(
                (c) =>
                    fuzzyMatch(query, c.title) ||
                    fuzzyMatch(query, c.description || '')
            )
            .slice(0, maxResults)
        return matches
    }, [
        commands,
        query,
        maxResults,
        showRecentCommands,
        recentCommandIds,
        maxRecentCommands,
    ])

    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {}
        for (const c of filtered) {
            const g = c.group || 'General'
            groups[g] = groups[g] || []
            groups[g].push(c)
        }
        return groups
    }, [filtered])

    // Flat list in visual rendering order (grouped)
    const visualOrder = useMemo(() => {
        const result: CommandItem[] = []
        for (const items of Object.values(grouped)) {
            result.push(...items)
        }
        return result
    }, [grouped])

    useEffect(() => {
        if (activeIndex >= visualOrder.length) setActiveIndex(0)
    }, [visualOrder.length, activeIndex])

    // Scroll active item into view
    useEffect(() => {
        const activeElement = itemRefs.current.get(activeIndex)
        if (activeElement && listRef.current) {
            // Check if scrollIntoView is available (not available in some test environments)
            if (typeof activeElement.scrollIntoView === 'function') {
                activeElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                })
            }
        }
    }, [activeIndex])

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return
        if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            setOpen(false)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            e.stopPropagation()
            setActiveIndex((i) => (i + 1) % visualOrder.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            e.stopPropagation()
            setActiveIndex(
                (i) => (i - 1 + visualOrder.length) % visualOrder.length
            )
        } else if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            const item = visualOrder[activeIndex]
            if (item) {
                // Track recent command
                setRecentCommandIds((prev) => {
                    const filtered = prev.filter((id) => id !== item.id)
                    return [item.id, ...filtered].slice(0, maxRecentCommands)
                })
                item.onSelect?.()
                setOpen(false)
            }
        }
    }

    const renderList = () => (
        <div
            className={classNames('command-palette__overlay', {
                'command-palette__overlay--visible': isOpen,
            })}
            role="dialog"
            aria-label={ariaLabel}
        >
            <div
                className="command-palette__backdrop"
                onClick={() => setOpen(false)}
            />
            <div className="command-palette__container">
                <div className="command-palette__input-wrap">
                    <input
                        ref={inputRef}
                        className="command-palette__input"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        aria-label={placeholder}
                    />
                    <div className="command-palette__shortcut">{shortcut}</div>
                </div>
                {visualOrder.length === 0 ? (
                    <div className="command-palette__empty">
                        <div className="command-palette__empty-icon">🔍</div>
                        <div className="command-palette__empty-message">
                            {emptyStateMessage}
                        </div>
                        {query && (
                            <div className="command-palette__empty-hint">
                                Try a different search term
                            </div>
                        )}
                    </div>
                ) : (
                    <ul
                        className="command-palette__list"
                        ref={listRef}
                        role="listbox"
                    >
                        {Object.entries(grouped).map(([groupName, items]) => (
                            <React.Fragment key={groupName}>
                                <li
                                    className="command-palette__group"
                                    aria-hidden
                                >
                                    {groupName}
                                </li>
                                {items.map((item) => {
                                    const visualIndex =
                                        visualOrder.indexOf(item)
                                    const active = visualIndex === activeIndex
                                    return (
                                        <li
                                            key={item.id}
                                            ref={(el) => {
                                                if (el) {
                                                    itemRefs.current.set(
                                                        visualIndex,
                                                        el
                                                    )
                                                } else {
                                                    itemRefs.current.delete(
                                                        visualIndex
                                                    )
                                                }
                                            }}
                                            role="option"
                                            aria-selected={active}
                                            data-index={visualIndex}
                                            className={classNames(
                                                'command-palette__item',
                                                {
                                                    'command-palette__item--active':
                                                        active,
                                                }
                                            )}
                                            onMouseEnter={() =>
                                                setActiveIndex(visualIndex)
                                            }
                                            onMouseDown={(e) => {
                                                // prevent blur
                                                e.preventDefault()
                                                // Track recent command
                                                setRecentCommandIds((prev) => {
                                                    const filtered =
                                                        prev.filter(
                                                            (id) =>
                                                                id !== item.id
                                                        )
                                                    return [
                                                        item.id,
                                                        ...filtered,
                                                    ].slice(
                                                        0,
                                                        maxRecentCommands
                                                    )
                                                })
                                                item.onSelect?.()
                                                setOpen(false)
                                            }}
                                        >
                                            {item.icon && (
                                                <div className="command-palette__item-icon">
                                                    {item.icon}
                                                </div>
                                            )}
                                            <div className="command-palette__item-content">
                                                <div className="command-palette__item-title">
                                                    {item.title}
                                                    {!query &&
                                                        showRecentCommands &&
                                                        recentCommandIds.includes(
                                                            item.id
                                                        ) && (
                                                            <span className="command-palette__recent-badge">
                                                                Recent
                                                            </span>
                                                        )}
                                                </div>
                                                {item.description && (
                                                    <div className="command-palette__item-desc">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                            {item.shortcut && (
                                                <div className="command-palette__item-shortcut">
                                                    {item.shortcut}
                                                </div>
                                            )}
                                        </li>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )

    if (!isOpen) return null
    return ReactDOM.createPortal(renderList(), document.body)
}

export default CommandPalette
