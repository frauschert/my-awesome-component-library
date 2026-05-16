import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom } from '../../utility/hooks/useAtom'
import { atom } from '../../utility/atom'
import { DropdownContext } from './context'
import { DropdownMenuItem, DropdownMenuProps } from './types'
import { classNames } from '../../utility/classnames'
import Portal from '../Portal'
import Input from '../Input'
import Button from '../Button'
import useOnClickOutside, {
    useMenuPosition,
} from '../../utility/hooks/useOnClickOutside'

import './dropdown-menu.scss'

// Create atoms outside component to maintain state
const createDropdownState = (defaultOpen: boolean) => atom(defaultOpen)
const createSelectedValuesState = <T extends any>(
    defaultValue: T | T[] | undefined
) =>
    atom<T[]>(
        Array.isArray(defaultValue)
            ? defaultValue
            : defaultValue
            ? [defaultValue]
            : []
    )

const DropdownMenu = <T extends any>({
    items,
    value,
    defaultValue,
    onChange,
    onOpenChange,
    open: controlledOpen,
    defaultOpen = false,
    trigger: triggerProp,
    renderItem,
    placement = 'bottom',
    closeOnSelect = true,
    multiple = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    maxHeight = 300,
    className,
    variant = 'secondary',
    size = 'medium',
    'aria-label': ariaLabel,
    disabled = false,
}: DropdownMenuProps<T>) => {
    // Refs
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // State atoms
    const openState = React.useMemo(() => createDropdownState(defaultOpen), [])
    const [isOpen, setIsOpen] = useAtom(openState)
    const selectedValuesState = React.useMemo(
        () => createSelectedValuesState<T>(defaultValue),
        []
    )
    const [selectedValues, setSelectedValues] = useAtom(selectedValuesState)
    const [searchQuery, setSearchQuery] = useState('')

    // Controlled mode handling
    const isControlled = controlledOpen !== undefined
    const isOpen_ = isControlled ? controlledOpen : isOpen

    // Event handlers
    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) {
                setIsOpen(nextOpen)
            }
            onOpenChange?.(nextOpen)
        },
        [isControlled, onOpenChange, setIsOpen]
    )

    const handleSelect = useCallback(
        (itemValue: T) => {
            if (multiple) {
                const newValues = selectedValues.includes(itemValue)
                    ? selectedValues.filter((v) => v !== itemValue)
                    : [...selectedValues, itemValue]
                setSelectedValues(newValues)
                onChange?.(newValues)
            } else {
                setSelectedValues([itemValue])
                onChange?.(itemValue)
                if (closeOnSelect) {
                    handleOpenChange(false)
                }
            }
        },
        [
            multiple,
            selectedValues,
            onChange,
            closeOnSelect,
            handleOpenChange,
            setSelectedValues,
        ]
    )

    // Click outside handling
    useOnClickOutside([menuRef, triggerRef], () => {
        if (isOpen_) {
            handleOpenChange(false)
        }
    })

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen_) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    handleOpenChange(false)
                    triggerRef.current?.focus()
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    // Focus next item or first if none focused
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    // Focus previous item or last if none focused
                    break
                case 'Enter':
                case ' ':
                    // Select focused item
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen_, handleOpenChange])

    // Position management
    const getMenuPosition = useMenuPosition(triggerRef, placement)

    // Focus management
    useEffect(() => {
        if (isOpen_ && searchable) {
            searchInputRef.current?.focus()
        }
    }, [isOpen_, searchable])

    // Position management
    useEffect(() => {
        if (!isOpen_) return

        const updatePosition = () => {
            if (!menuRef.current || !triggerRef.current) return
            const rect = triggerRef.current.getBoundingClientRect()
            menuRef.current.style.top = `${rect.bottom}px`
            menuRef.current.style.left = `${rect.left}px`
            menuRef.current.style.minWidth = `${Math.max(rect.width, 200)}px`
        }

        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)

        updatePosition()

        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [isOpen_])

    // Filter items based on search
    const filteredItems =
        searchable && searchQuery
            ? items.filter(
                  (item) =>
                      typeof item.label === 'string' &&
                      item.label
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
              )
            : items

    // Type guard for React elements
    const isReactElement = (element: any): element is React.ReactElement => {
        return React.isValidElement(element)
    }

    // Render item content
    const renderItemContent = (item: DropdownMenuItem<T>) => {
        if (renderItem) {
            return renderItem(item)
        }
        return (
            <>
                {item.icon && (
                    <span className="dropdown-menu__item-icon">
                        {item.icon}
                    </span>
                )}
                <span className="dropdown-menu__item-label">{item.label}</span>
                {multiple && selectedValues.includes(item.value) && (
                    <span className="dropdown-menu__item-check">✓</span>
                )}
            </>
        )
    }

    const menuClasses = classNames(
        'dropdown-menu',
        `dropdown-menu--${variant}`,
        `dropdown-menu--${size}`,
        `dropdown-menu--${placement}`,
        {
            'dropdown-menu--open': isOpen_,
            'dropdown-menu--disabled': disabled,
        },
        className
    )

    return (
        <DropdownContext.Provider
            value={{
                selectedValues,
                isOpen: isOpen_,
                setIsOpen: handleOpenChange,
                onSelect: handleSelect,
                multiple,
            }}
        >
            <div className={menuClasses}>
                <Button
                    ref={triggerRef}
                    className="dropdown-menu__trigger"
                    variant={variant === 'default' ? 'secondary' : variant}
                    size={
                        size === 'small'
                            ? 'small'
                            : size === 'large'
                            ? 'large'
                            : 'medium'
                    }
                    onClick={(e) => {
                        e.preventDefault()
                        if (!disabled) {
                            handleOpenChange(!isOpen_)
                        }
                    }}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen_}
                >
                    {typeof triggerProp === 'string'
                        ? triggerProp
                        : isReactElement(triggerProp)
                        ? triggerProp
                        : null}
                </Button>

                {isOpen_ && (
                    <Portal>
                        <div
                            className="dropdown-menu__content"
                            ref={menuRef}
                            role="listbox"
                            aria-labelledby={ariaLabel}
                            style={{
                                maxHeight,
                                position: 'fixed',
                                ...getMenuPosition(),
                                minWidth: Math.max(
                                    triggerRef.current?.getBoundingClientRect()
                                        .width ?? 200,
                                    200
                                ),
                            }}
                        >
                            {searchable && (
                                <div className="dropdown-menu__search">
                                    <Input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        placeholder={searchPlaceholder}
                                        onValueChange={(value) =>
                                            setSearchQuery(value.toString())
                                        }
                                        sizeVariant="sm"
                                        clearable
                                        onClear={() => setSearchQuery('')}
                                    />
                                </div>
                            )}

                            <div className="dropdown-menu__items">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={classNames(
                                            'dropdown-menu__item',
                                            {
                                                'dropdown-menu__item--selected':
                                                    selectedValues.includes(
                                                        item.value
                                                    ),
                                                'dropdown-menu__item--disabled':
                                                    item.disabled || false,
                                            }
                                        )}
                                        role="option"
                                        aria-selected={selectedValues.includes(
                                            item.value
                                        )}
                                        onClick={() =>
                                            !item.disabled &&
                                            handleSelect(item.value)
                                        }
                                        tabIndex={-1}
                                    >
                                        {renderItemContent(item)}
                                    </div>
                                ))}
                                {filteredItems.length === 0 && (
                                    <div className="dropdown-menu__no-results">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </div>
                    </Portal>
                )}
            </div>
        </DropdownContext.Provider>
    )
}

export default DropdownMenu
