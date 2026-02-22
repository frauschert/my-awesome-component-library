import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { classNames } from '../../utility/classnames'
import './OTPInput.scss'

export type OTPInputSize = 'small' | 'medium' | 'large'

export interface OTPInputProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Number of OTP digits */
    length?: number
    /** Current value (controlled) */
    value?: string
    /** Default value (uncontrolled) */
    defaultValue?: string
    /** Callback when value changes */
    onChange?: (value: string) => void
    /** Callback when all digits are filled */
    onComplete?: (value: string) => void
    /** Size variant */
    size?: OTPInputSize
    /** Whether the input is disabled */
    disabled?: boolean
    /** Whether to mask the input (like a password) */
    mask?: boolean
    /** Error state */
    error?: boolean | string
    /** Auto-focus first input on mount */
    autoFocus?: boolean
    /** Placeholder per field */
    placeholder?: string
    /** Input type */
    type?: 'text' | 'number'
}

const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
    (
        {
            length = 6,
            value: controlledValue,
            defaultValue = '',
            onChange,
            onComplete,
            size = 'medium',
            disabled = false,
            mask = false,
            error = false,
            autoFocus = false,
            placeholder = '○',
            type = 'text',
            className,
            ...rest
        },
        ref
    ) => {
        const isControlled = controlledValue !== undefined
        const [internalValue, setInternalValue] = useState(
            defaultValue.slice(0, length)
        )
        const currentValue = isControlled ? controlledValue : internalValue
        const inputRefs = useRef<(HTMLInputElement | null)[]>([])

        const digits = Array.from({ length }, (_, i) => currentValue[i] ?? '')

        const updateValue = useCallback(
            (newValue: string) => {
                const clamped = newValue.slice(0, length)
                if (!isControlled) setInternalValue(clamped)
                onChange?.(clamped)
                if (clamped.length === length) onComplete?.(clamped)
            },
            [isControlled, length, onChange, onComplete]
        )

        const focusInput = (index: number) => {
            const clamped = Math.max(0, Math.min(index, length - 1))
            inputRefs.current[clamped]?.focus()
        }

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            index: number
        ) => {
            const inputVal = e.target.value
            if (type === 'number' && !/^\d*$/.test(inputVal)) return

            // Take only the last character typed
            const char = inputVal.slice(-1)
            const arr = digits.slice()
            arr[index] = char
            const next = arr.join('')
            updateValue(next)

            if (char && index < length - 1) {
                focusInput(index + 1)
            }
        }

        const handleKeyDown = (
            e: React.KeyboardEvent<HTMLInputElement>,
            index: number
        ) => {
            if (e.key === 'Backspace') {
                e.preventDefault()
                const arr = digits.slice()
                if (arr[index]) {
                    arr[index] = ''
                    updateValue(arr.join(''))
                } else if (index > 0) {
                    arr[index - 1] = ''
                    updateValue(arr.join(''))
                    focusInput(index - 1)
                }
            } else if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault()
                focusInput(index - 1)
            } else if (e.key === 'ArrowRight' && index < length - 1) {
                e.preventDefault()
                focusInput(index + 1)
            }
        }

        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault()
            let pasted = e.clipboardData.getData('text/plain').trim()
            if (type === 'number') pasted = pasted.replace(/\D/g, '')
            pasted = pasted.slice(0, length)
            if (pasted) {
                updateValue(pasted)
                focusInput(Math.min(pasted.length, length - 1))
            }
        }

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select()
        }

        const errorMessage = typeof error === 'string' ? error : undefined

        return (
            <div
                ref={ref}
                className={classNames(
                    'otp-input',
                    `otp-input--${size}`,
                    disabled && 'otp-input--disabled',
                    error && 'otp-input--error',
                    className
                )}
                role="group"
                aria-label="One-time password"
                {...rest}
            >
                <div className="otp-input__fields">
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputRefs.current[i] = el
                            }}
                            type={mask ? 'password' : 'text'}
                            inputMode={type === 'number' ? 'numeric' : 'text'}
                            autoComplete="one-time-code"
                            maxLength={2}
                            value={digit}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="otp-input__field"
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            onFocus={handleFocus}
                            aria-label={`Digit ${i + 1} of ${length}`}
                            autoFocus={autoFocus && i === 0}
                        />
                    ))}
                </div>
                {errorMessage && (
                    <span className="otp-input__error" role="alert">
                        {errorMessage}
                    </span>
                )}
            </div>
        )
    }
)

OTPInput.displayName = 'OTPInput'
export default OTPInput
