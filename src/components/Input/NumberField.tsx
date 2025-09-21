import React, { useMemo, useRef, useState } from 'react'
import Input from './Input'
import type { InputProps, NumberInputProps } from './types'

export type NumberFieldProps = Omit<
    InputProps & NumberInputProps,
    'type' | 'onChange' | 'initialValue' | 'value'
> & {
    value?: number | null
    defaultValue?: number | null
    onValueChange?: (value: number | null) => void
    onDebouncedValueChange?: (value: number | null) => void
    allowEmpty?: boolean
    clampOnBlur?: boolean
    stepOnArrow?: boolean
    preventWheel?: boolean
}

const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
    (
        {
            value,
            defaultValue = null,
            onValueChange,
            onDebouncedValueChange,
            min,
            max,
            step,
            allowEmpty = true,
            clampOnBlur = false,
            stepOnArrow = true,
            preventWheel = true,
            ...rest
        },
        ref
    ) => {
        // manage string ui value and keep parsed numeric in callbacks
        const isControlled = value !== undefined
        const [inner, setInner] = useState<string>(
            value != null
                ? String(value)
                : defaultValue != null
                ? String(defaultValue)
                : ''
        )
        const lastEmitted = useRef<number | null>(value ?? defaultValue ?? null)

        React.useEffect(() => {
            if (isControlled) {
                setInner(value != null ? String(value) : allowEmpty ? '' : '')
                lastEmitted.current = value ?? null
            }
        }, [isControlled, value, allowEmpty])

        const parse = (raw: string): number | null => {
            if (raw === '') return allowEmpty ? null : lastEmitted.current
            const n = Number(raw)
            return Number.isFinite(n) ? n : null
        }

        const handleValueChange = (raw: string) => {
            setInner(raw)
            const n = parse(raw)
            if (onValueChange) onValueChange(n)
        }

        const handleDebouncedValueChange = (raw: string) => {
            const n = parse(raw)
            if (onDebouncedValueChange) onDebouncedValueChange(n)
            lastEmitted.current = n
        }

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (!clampOnBlur) return
            const n = parse(e.currentTarget.value)
            if (n == null) return
            let clamped = n
            if (typeof min === 'number') clamped = Math.max(clamped, min)
            if (typeof max === 'number') clamped = Math.min(clamped, max)
            if (!isControlled) setInner(String(clamped))
            if (onValueChange) onValueChange(clamped)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!stepOnArrow) return
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
            e.preventDefault()
            const current = parse(inner) ?? 0
            const s = typeof step === 'number' ? step : 1
            let next = e.key === 'ArrowUp' ? current + s : current - s
            if (typeof min === 'number') next = Math.max(next, min)
            if (typeof max === 'number') next = Math.min(next, max)
            if (!isControlled) setInner(String(next))
            if (onValueChange) onValueChange(next)
        }

        const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
            if (!preventWheel) return
            // prevent accidental scroll changes unless ctrlKey is pressed
            if (!e.ctrlKey) e.preventDefault()
        }
        return (
            <Input
                ref={ref}
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                value={inner as any}
                onValueChange={(v) =>
                    typeof v === 'string' && handleValueChange(v)
                }
                onDebouncedValueChange={(v) =>
                    typeof v === 'string' && handleDebouncedValueChange(v)
                }
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onWheel={handleWheel}
                min={min}
                max={max}
                step={step}
                {...(rest as any)}
            />
        )
    }
)

NumberField.displayName = 'NumberField'

export default NumberField
