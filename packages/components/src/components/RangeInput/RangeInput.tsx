import React, { useState, useCallback, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import useDebounceEffect from '../../utility/hooks/useDebounceEffect'
import './range-input.scss'

export type RangeInputProps = {
    /** Current value (controlled) */
    value?: number
    /** Initial value (uncontrolled) */
    defaultValue?: number
    /** Minimum value */
    min: number
    /** Maximum value */
    max: number
    /** Step increment */
    step?: number
    /** Called on value change */
    onChange?: (value: number) => void
    /** Called when user starts dragging */
    onChangeStart?: (value: number) => void
    /** Called when user stops dragging */
    onChangeEnd?: (value: number) => void
    /** Debounce delay in ms (0 = no debounce) */
    debounce?: number
    /** Show current value as tooltip */
    showTooltip?: boolean
    /** Show min/max labels */
    showMinMax?: boolean
    /** Show number input alongside range */
    showNumberInput?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Accessible label */
    label?: string
    /** Format function for display */
    formatValue?: (value: number) => string
    /** Size variant */
    size?: 'sm' | 'md' | 'lg'
    /** Color variant */
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning'
    /** Additional class name */
    className?: string
    /** ID for label association */
    id?: string
}

/**
 * RangeInput - A dual-input range slider with number input
 *
 * @example
 * ```tsx
 * // Controlled
 * <RangeInput value={volume} onChange={setVolume} min={0} max={100} />
 *
 * // Uncontrolled
 * <RangeInput defaultValue={50} min={0} max={100} onChange={handleChange} />
 *
 * // With features
 * <RangeInput
 *   value={price}
 *   onChange={setPrice}
 *   min={0}
 *   max={1000}
 *   step={10}
 *   showTooltip
 *   showMinMax
 *   formatValue={(v) => `$${v}`}
 *   variant="primary"
 * />
 * ```
 */
function RangeInput(props: RangeInputProps) {
    const {
        value: controlledValue,
        defaultValue = 0,
        min,
        max,
        step = 1,
        onChange,
        onChangeStart,
        onChangeEnd,
        debounce = 0,
        showTooltip = false,
        showMinMax = false,
        showNumberInput = true,
        disabled = false,
        label,
        formatValue,
        size = 'md',
        variant = 'primary',
        className,
        id,
    } = props

    // Controlled vs uncontrolled
    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue)
    const value = isControlled ? controlledValue : internalValue

    const [isDragging, setIsDragging] = useState(false)
    const [showTooltipState, setShowTooltipState] = useState(false)
    const inputId = useRef(
        id || `range-input-${Math.random().toString(36).substr(2, 9)}`
    )

    // Clamp value to valid range and snap to step
    const clampAndSnap = useCallback(
        (val: number): number => {
            const clamped = Math.max(min, Math.min(max, val))
            const snapped = Math.round(clamped / step) * step
            // Handle floating point precision
            return Math.round(snapped * 1000) / 1000
        },
        [min, max, step]
    )

    // Update internal value and call onChange
    const updateValue = useCallback(
        (newValue: number) => {
            const finalValue = clampAndSnap(newValue)

            if (!isControlled) {
                setInternalValue(finalValue)
            }

            onChange?.(finalValue)
        },
        [isControlled, clampAndSnap, onChange]
    )

    // Debounced onChange (only if debounce > 0)
    useDebounceEffect(
        () => {
            if (debounce > 0) {
                onChange?.(value)
            }
        },
        debounce,
        [value]
    )

    // Call onChange on mount with initial value
    useEffect(() => {
        if (onChange && !isControlled) {
            onChange(value)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleRangeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseFloat(event.target.value)
            if (!isNaN(newValue)) {
                if (debounce === 0) {
                    updateValue(newValue)
                } else {
                    // Update display immediately, debounce the callback
                    if (!isControlled) {
                        setInternalValue(clampAndSnap(newValue))
                    }
                }
            }
        },
        [updateValue, debounce, isControlled, clampAndSnap]
    )

    const handleNumberChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseFloat(event.target.value)
            if (!isNaN(newValue)) {
                updateValue(newValue)
            }
        },
        [updateValue]
    )

    const handleMouseDown = useCallback(() => {
        setIsDragging(true)
        onChangeStart?.(value)
    }, [onChangeStart, value])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        onChangeEnd?.(value)
    }, [onChangeEnd, value])

    const handleMouseEnter = useCallback(() => {
        if (showTooltip) {
            setShowTooltipState(true)
        }
    }, [showTooltip])

    const handleMouseLeave = useCallback(() => {
        if (!isDragging) {
            setShowTooltipState(false)
        }
    }, [isDragging])

    const displayValue = formatValue ? formatValue(value) : value.toString()
    const percentage = ((value - min) / (max - min)) * 100

    return (
        <div
            className={classNames(
                'range-input',
                `range-input--${size}`,
                `range-input--${variant}`,
                disabled && 'range-input--disabled',
                className
            )}
        >
            {label && (
                <label htmlFor={inputId.current} className="range-input__label">
                    {label}
                </label>
            )}

            <div className="range-input__container">
                {showMinMax && (
                    <span className="range-input__min-label">
                        {formatValue ? formatValue(min) : min}
                    </span>
                )}

                <div className="range-input__slider-container">
                    <input
                        type="range"
                        id={inputId.current}
                        className="range-input__slider"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={handleRangeChange}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        disabled={disabled}
                        aria-label={label || `Range from ${min} to ${max}`}
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuenow={value}
                        aria-valuetext={displayValue}
                    />
                    <div
                        className="range-input__track"
                        style={{ width: `${percentage}%` }}
                    />
                    {showTooltip && (showTooltipState || isDragging) && (
                        <div
                            className="range-input__tooltip"
                            style={{ left: `${percentage}%` }}
                        >
                            {displayValue}
                        </div>
                    )}
                </div>

                {showMinMax && (
                    <span className="range-input__max-label">
                        {formatValue ? formatValue(max) : max}
                    </span>
                )}

                {showNumberInput && (
                    <input
                        type="number"
                        className="range-input__number"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={handleNumberChange}
                        disabled={disabled}
                        aria-label={`${label || 'Value'} (number input)`}
                    />
                )}
            </div>
        </div>
    )
}

export default React.memo(RangeInput)
