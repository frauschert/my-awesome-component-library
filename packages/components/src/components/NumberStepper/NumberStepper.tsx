import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { classNames } from '../../utility/classnames'
import './NumberStepper.scss'

export type NumberStepperSize = 'small' | 'medium' | 'large'

export interface NumberStepperProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'size' | 'onChange' | 'type' | 'value' | 'defaultValue'
    > {
    /** Current value (controlled) */
    value?: number
    /** Default value (uncontrolled) */
    defaultValue?: number
    /** Callback when value changes */
    onChange?: (value: number) => void
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step increment/decrement amount */
    step?: number
    /** Label text */
    label?: string
    /** Size variant */
    size?: NumberStepperSize
    /** Whether the input is disabled */
    disabled?: boolean
    /** Error message */
    error?: string
    /** Custom className */
    className?: string
}

const MinusIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const PlusIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max)
}

const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(
    (
        {
            value: controlledValue,
            defaultValue = 0,
            onChange,
            min = -Infinity,
            max = Infinity,
            step = 1,
            label,
            size = 'medium',
            disabled = false,
            error,
            className,
            id,
            ...rest
        },
        ref
    ) => {
        const isControlled = controlledValue !== undefined
        const [internalValue, setInternalValue] = useState(
            clamp(defaultValue, min, max)
        )
        const currentValue = isControlled ? controlledValue : internalValue
        const inputRef = useRef<HTMLInputElement>(null)

        const setValue = useCallback(
            (next: number) => {
                const clamped = clamp(next, min, max)
                if (!isControlled) setInternalValue(clamped)
                onChange?.(clamped)
            },
            [isControlled, min, max, onChange]
        )

        const handleDecrement = () => {
            if (!disabled) setValue(currentValue - step)
        }

        const handleIncrement = () => {
            if (!disabled) setValue(currentValue + step)
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value
            if (raw === '' || raw === '-') return
            const parsed = parseFloat(raw)
            if (!isNaN(parsed)) setValue(parsed)
        }

        const handleBlur = () => {
            // Re-clamp on blur
            setValue(currentValue)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                handleIncrement()
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                handleDecrement()
            }
        }

        const atMin = currentValue <= min
        const atMax = currentValue >= max

        return (
            <div
                className={classNames(
                    'number-stepper',
                    `number-stepper--${size}`,
                    disabled && 'number-stepper--disabled',
                    error && 'number-stepper--error',
                    className
                )}
            >
                {label && (
                    <label className="number-stepper__label" htmlFor={id}>
                        {label}
                    </label>
                )}
                <div className="number-stepper__controls">
                    <button
                        type="button"
                        className="number-stepper__btn number-stepper__btn--decrement"
                        onClick={handleDecrement}
                        disabled={disabled || atMin}
                        aria-label="Decrease value"
                        tabIndex={-1}
                    >
                        <MinusIcon />
                    </button>
                    <input
                        ref={(node) => {
                            ;(
                                inputRef as React.MutableRefObject<HTMLInputElement | null>
                            ).current = node
                            if (typeof ref === 'function') ref(node)
                            else if (ref)
                                (
                                    ref as React.MutableRefObject<HTMLInputElement | null>
                                ).current = node
                        }}
                        type="text"
                        inputMode="numeric"
                        role="spinbutton"
                        id={id}
                        className="number-stepper__input"
                        value={currentValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        aria-valuenow={currentValue}
                        aria-valuemin={min !== -Infinity ? min : undefined}
                        aria-valuemax={max !== Infinity ? max : undefined}
                        aria-invalid={!!error}
                        {...rest}
                    />
                    <button
                        type="button"
                        className="number-stepper__btn number-stepper__btn--increment"
                        onClick={handleIncrement}
                        disabled={disabled || atMax}
                        aria-label="Increase value"
                        tabIndex={-1}
                    >
                        <PlusIcon />
                    </button>
                </div>
                {error && (
                    <span className="number-stepper__error" role="alert">
                        {error}
                    </span>
                )}
            </div>
        )
    }
)

NumberStepper.displayName = 'NumberStepper'
export default NumberStepper
