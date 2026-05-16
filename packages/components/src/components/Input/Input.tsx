import React, { forwardRef, useMemo, useRef, useState } from 'react'
import useDebounceEffect from '../../utility/hooks/useDebounceEffect'
import { InputProps } from './types'
import uniqueId from '../../utility/uniqueId'

import './input.scss'

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        type,
        label,
        helperText,
        errorText,
        invalid,
        id: idProp,
        initialValue,
        onChange: onLegacyTypedChange,
        onValueChange,
        onDebouncedValueChange,
        debounceMs = 500,
        locked: lockedProp,
        focussed: focussedProp,
        sizeVariant = 'md',
        startAdornment,
        endAdornment,
        clearable,
        onClear,
        value: controlledValue,
        defaultValue: defaultValueProp,
        ...rest
    } = props
    const [locked, setLocked] = useState(lockedProp ?? false)
    const [focussed, setFocussed] = useState((focussedProp && locked) || false)
    const [value, setValue] = useInputEffect({
        type,
        // seed from explicit initialValue first; else if uncontrolled, seed from defaultValue
        initialValue:
            initialValue ??
            (controlledValue === undefined
                ? (defaultValueProp as any)
                : undefined),
        onLegacyTypedChange: onLegacyTypedChange as any,
        onValueChange,
        onDebouncedValueChange,
        debounceMs,
    })

    // Sync controlled value if provided
    React.useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue as any)
        }
    }, [controlledValue, setValue])

    // ids for a11y wiring
    const generatedIdRef = useRef(`input-${uniqueId()}`)
    const id = idProp ?? generatedIdRef.current
    const helperId = helperText ? `${id}-helper` : undefined
    const errorId = errorText ? `${id}-error` : undefined
    const describedBy = useMemo(
        () => [helperId, errorId].filter(Boolean).join(' ') || undefined,
        [helperId, errorId]
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value
        // Emit raw string immediately for wrappers/consumers
        onValueChange?.(next)
        switch (type) {
            case 'number': {
                if (next === '') {
                    setValue('')
                    break
                }
                const parsed = Number(next)
                if (!Number.isNaN(parsed)) setValue(parsed)
                else setValue(next)
                break
            }
            case 'text':
                setValue(next)
                break
            default:
                setValue(next)
        }
    }

    const hasValue = useMemo(() => {
        if (typeof value === 'number') return true
        return value !== '' && value !== undefined && value !== null
    }, [value])

    const classes = [
        'field',
        `field--${sizeVariant}`,
        (locked ? focussed : focussed || hasValue) ? 'focussed' : '',
        locked && !focussed ? 'locked' : '',
    ]
        .filter(Boolean)
        .join(' ')

    // compose refs: keep internal ref and forward ref
    const innerRef = useRef<HTMLInputElement | null>(null)
    const setRefs = (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
    }

    const handleClear = () => {
        // clear internal and notify
        setValue('')
        onValueChange?.('')
        onDebouncedValueChange?.('')
        if (type === 'text') onLegacyTypedChange?.('')
        onClear?.()
        // refocus input for usability
        innerRef.current?.focus()
    }

    const handleIncrement = () => {
        if (type !== 'number') return
        const currentValue =
            typeof value === 'number' ? value : parseFloat(String(value)) || 0
        const step = rest.step ? Number(rest.step) : 1
        const max = rest.max !== undefined ? Number(rest.max) : undefined
        const newValue = currentValue + step

        if (max !== undefined && newValue > max) return

        setValue(newValue)
        onValueChange?.(newValue)
    }

    const handleDecrement = () => {
        if (type !== 'number') return
        const currentValue =
            typeof value === 'number' ? value : parseFloat(String(value)) || 0
        const step = rest.step ? Number(rest.step) : 1
        const min = rest.min !== undefined ? Number(rest.min) : undefined
        const newValue = currentValue - step

        if (min !== undefined && newValue < min) return

        setValue(newValue)
        onValueChange?.(newValue)
    }

    const showClear =
        !!clearable &&
        ((typeof value === 'string' && value.length > 0) ||
            (typeof value === 'number' && !Number.isNaN(value)))

    return (
        <div className={classes}>
            {startAdornment && (
                <div
                    className="field__adornment field__adornment--start"
                    aria-hidden
                >
                    {startAdornment}
                </div>
            )}
            <input
                {...rest}
                id={id}
                ref={setRefs}
                type={type}
                value={value}
                onChange={handleChange}
                aria-invalid={invalid || !!errorText || undefined}
                aria-describedby={describedBy}
                // keep previous behavior: if user passed a placeholder use it; otherwise, keep label as placeholder for now
                placeholder={rest.placeholder ?? label}
                onFocus={() => !locked && setFocussed(true)}
                onBlur={() => !locked && setFocussed(false)}
            />
            {label && (
                <label
                    htmlFor={id}
                    className={invalid ? 'error' : undefined}
                    onClick={() => {
                        innerRef.current?.focus()
                    }}
                >
                    {label}
                </label>
            )}
            {(endAdornment || showClear || type === 'number') && (
                <div className="field__adornment field__adornment--end">
                    {endAdornment}
                    {type === 'number' && (
                        <div className="field__number-controls">
                            <button
                                type="button"
                                className="field__number-button field__number-button--up"
                                aria-label="Increment value"
                                onClick={handleIncrement}
                                tabIndex={-1}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <path
                                        d="M6 3L9 7H3L6 3Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="field__number-button field__number-button--down"
                                aria-label="Decrement value"
                                onClick={handleDecrement}
                                tabIndex={-1}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <path
                                        d="M6 9L3 5H9L6 9Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                    {showClear && (
                        <button
                            type="button"
                            className="field__clear"
                            aria-label="Clear input"
                            onClick={handleClear}
                        >
                            ×
                        </button>
                    )}
                </div>
            )}
            {helperText && (
                <div id={helperId} className="field__helper">
                    {helperText}
                </div>
            )}
            {errorText && (
                <div id={errorId} className="field__error">
                    {errorText}
                </div>
            )}
        </div>
    )
})

Input.displayName = 'Input'

type UseInputEffectParams = {
    type: 'text' | 'number'
    initialValue?: string | number
    onLegacyTypedChange?: (value: string | number) => void
    onValueChange?: (value: string | number) => void
    onDebouncedValueChange?: (value: string | number) => void
    debounceMs: number
}

const useInputEffect = (props: UseInputEffectParams) => {
    const [value, setValue] = useState(props.initialValue ?? '')
    // Debounced callbacks (legacy typed and debounced value)
    useDebounceEffect(
        () => {
            // legacy typed onChange
            if (props.onLegacyTypedChange) {
                if (props.type === 'number' && typeof value === 'number') {
                    props.onLegacyTypedChange(value)
                } else if (props.type === 'text' && typeof value === 'string') {
                    props.onLegacyTypedChange(value)
                }
            }
            // debounced value change
            if (props.onDebouncedValueChange) {
                if (props.type === 'number' && typeof value === 'number') {
                    props.onDebouncedValueChange(value)
                } else if (props.type === 'text' && typeof value === 'string') {
                    props.onDebouncedValueChange(value)
                }
            }
        },
        props.debounceMs,
        [value]
    )

    return [value, setValue] as const
}

export default Input
