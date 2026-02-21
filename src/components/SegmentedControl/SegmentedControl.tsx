import React, { forwardRef, useId, useRef } from 'react'
import './SegmentedControl.scss'
import { classNames } from '../../utility/classnames'

export type SegmentedControlSize = 'small' | 'medium' | 'large'
export type SegmentedControlOrientation = 'horizontal' | 'vertical'

export interface SegmentedControlItem {
    /** Unique value for this segment */
    value: string
    /** Display label */
    label: React.ReactNode
    /** Icon rendered before the label */
    icon?: React.ReactNode
    /** Disabled state for this individual segment */
    disabled?: boolean
    /** Accessible label override (use when label is icon-only) */
    'aria-label'?: string
}

export interface SegmentedControlProps {
    /** The items to display */
    items: SegmentedControlItem[]
    /** Currently selected value (controlled) */
    value?: string
    /** Default selected value (uncontrolled) */
    defaultValue?: string
    /** Called when the selection changes */
    onChange?: (value: string) => void
    /** Size variant */
    size?: SegmentedControlSize
    /** Layout direction */
    orientation?: SegmentedControlOrientation
    /** Disable the entire control */
    disabled?: boolean
    /** Stretch to fill container width */
    fullWidth?: boolean
    /** Accessible group name */
    'aria-label'?: string
    /** Additional class name */
    className?: string
    /** Additional styles */
    style?: React.CSSProperties
}

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
    (
        {
            items,
            value: controlledValue,
            defaultValue,
            onChange,
            size = 'medium',
            orientation = 'horizontal',
            disabled = false,
            fullWidth = false,
            'aria-label': ariaLabel,
            className,
            style,
        },
        ref
    ) => {
        const groupId = useId()

        const [internalValue, setInternalValue] = React.useState<
            string | undefined
        >(defaultValue ?? items.find((i) => !i.disabled)?.value)

        const isControlled = controlledValue !== undefined
        const selectedValue = isControlled ? controlledValue : internalValue

        const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

        const handleSelect = (item: SegmentedControlItem) => {
            if (disabled || item.disabled) return
            if (item.value === selectedValue) return
            if (!isControlled) setInternalValue(item.value)
            onChange?.(item.value)
        }

        const handleKeyDown = (
            e: React.KeyboardEvent<HTMLButtonElement>,
            index: number
        ) => {
            const enabledItems = items
                .map((item, i) => ({ item, i }))
                .filter(({ item }) => !item.disabled && !disabled)

            const currentEnabledIdx = enabledItems.findIndex(
                ({ i }) => i === index
            )

            const isHorizontal = orientation === 'horizontal'
            const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
            const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

            let targetIdx = -1
            if (e.key === nextKey) {
                e.preventDefault()
                targetIdx = (currentEnabledIdx + 1) % enabledItems.length
            } else if (e.key === prevKey) {
                e.preventDefault()
                targetIdx =
                    (currentEnabledIdx - 1 + enabledItems.length) %
                    enabledItems.length
            } else if (e.key === 'Home') {
                e.preventDefault()
                targetIdx = 0
            } else if (e.key === 'End') {
                e.preventDefault()
                targetIdx = enabledItems.length - 1
            }

            if (targetIdx >= 0) {
                const { item, i } = enabledItems[targetIdx]
                itemRefs.current[i]?.focus()
                handleSelect(item)
            }
        }

        return (
            <div
                ref={ref}
                role="radiogroup"
                aria-label={ariaLabel}
                aria-orientation={orientation}
                aria-disabled={disabled || undefined}
                className={classNames(
                    'segmented-control',
                    `segmented-control--${size}`,
                    `segmented-control--${orientation}`,
                    fullWidth && 'segmented-control--full-width',
                    disabled && 'segmented-control--disabled',
                    className
                )}
                style={style}
            >
                {items.map((item, index) => {
                    const isSelected = item.value === selectedValue
                    const isDisabled = disabled || !!item.disabled

                    return (
                        <button
                            key={item.value}
                            ref={(el) => {
                                itemRefs.current[index] = el
                            }}
                            type="button"
                            role="radio"
                            id={`${groupId}-${item.value}`}
                            aria-checked={isSelected}
                            aria-label={item['aria-label']}
                            aria-disabled={isDisabled || undefined}
                            disabled={isDisabled}
                            tabIndex={isSelected ? 0 : -1}
                            className={classNames(
                                'segmented-control__item',
                                isSelected &&
                                    'segmented-control__item--selected',
                                isDisabled &&
                                    'segmented-control__item--disabled'
                            )}
                            onClick={() => handleSelect(item)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        >
                            {item.icon && (
                                <span
                                    className="segmented-control__icon"
                                    aria-hidden="true"
                                >
                                    {item.icon}
                                </span>
                            )}
                            {item.label && (
                                <span className="segmented-control__label">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }
)

SegmentedControl.displayName = 'SegmentedControl'

export default SegmentedControl
