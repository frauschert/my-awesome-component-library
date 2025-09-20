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
        onChange: onValueChange,
        locked: lockedProp,
        focussed: focussedProp,
        sizeVariant = 'md',
        ...rest
    } = props
    const [locked, setLocked] = useState(lockedProp ?? false)
    const [focussed, setFocussed] = useState((focussedProp && locked) || false)
    const [value, setValue] = useInputEffect({
        type,
        initialValue,
        onChange: onValueChange as any,
    })

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
        else if (ref && 'current' in (ref as any)) (ref as any).current = node
    }

    return (
        <div className={classes}>
            <input
                {...rest}
                id={id}
                ref={setRefs}
                type={type}
                value={value as any}
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
    onChange: (value: string | number) => void
}

const useInputEffect = (props: UseInputEffectParams) => {
    const [value, setValue] = useState(props.initialValue ?? '')
    useDebounceEffect(
        () => {
            if (props.type === 'number' && typeof value === 'number') {
                props.onChange(value)
            } else if (props.type === 'text' && typeof value === 'string') {
                props.onChange(value)
            }
        },
        500,
        [value]
    )

    return [value, setValue] as const
}

export default Input
