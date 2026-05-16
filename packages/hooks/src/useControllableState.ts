import { useCallback, useRef, useState } from 'react'

export interface UseControllableStateOptions<T> {
    /** The controlled value (if provided, the component is controlled) */
    value?: T
    /** The default value for uncontrolled mode */
    defaultValue: T
    /** Called when the value changes (both controlled and uncontrolled) */
    onChange?: (value: T) => void
}

export interface UseControllableStateReturn<T> {
    /** The current value (controlled or internal) */
    value: T
    /** Update handler: sets internal state if uncontrolled, always calls onChange */
    setValue: (next: T | ((prev: T) => T)) => void
    /** Whether the component is in controlled mode */
    isControlled: boolean
}

/**
 * Manages the controlled vs uncontrolled state pattern.
 * Provides a unified value + setter regardless of mode.
 */
export default function useControllableState<T>({
    value: controlledValue,
    defaultValue,
    onChange,
}: UseControllableStateOptions<T>): UseControllableStateReturn<T> {
    const isControlled = controlledValue !== undefined
    const isControlledRef = useRef(isControlled)

    if (process.env.NODE_ENV !== 'production') {
        if (isControlledRef.current !== isControlled) {
            console.warn(
                'useControllableState: A component changed from ' +
                    (isControlledRef.current ? 'controlled' : 'uncontrolled') +
                    ' to ' +
                    (isControlled ? 'controlled' : 'uncontrolled') +
                    '. This is not supported.'
            )
        }
    }

    const [internalValue, setInternalValue] = useState<T>(defaultValue)

    const currentValue = isControlled ? controlledValue : internalValue

    const setValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            const nextValue =
                typeof next === 'function'
                    ? (next as (prev: T) => T)(currentValue)
                    : next

            if (!isControlled) {
                setInternalValue(nextValue)
            }
            onChange?.(nextValue)
        },
        [isControlled, currentValue, onChange]
    )

    return { value: currentValue, setValue, isControlled }
}
