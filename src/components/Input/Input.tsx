import React, { forwardRef, useState } from 'react'
import useDebounceEffect from '../../utility/hooks/useDebounceEffect'
import { InputProps } from './types'

import './input.scss'

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { type, label, ...rest } = props
    const [locked, setLocked] = useState(props.locked ?? false)
    const [focussed, setFocussed] = useState(
        (props.focussed && locked) || false
    )
    const [value, setValue] = useInputEffect({ ...props })

    const handleNumberChange = (value: string) => {
        const parsedValue = parseFloat(value)
        if (isNaN(parsedValue)) {
            return
        }
        setValue(parsedValue)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (type) {
            case 'number':
                handleNumberChange(event.target.value)
                break
            case 'text':
                setValue(event.target.value)
                break
            default:
                setValue(event.target.value)
        }
    }

    const fieldClassName = `field ${
        (locked ? focussed : focussed || value) && 'focussed'
    } ${locked && !focussed && 'locked'}`

    return (
        <input
            {...rest}
            ref={ref}
            type={type}
            value={value}
            onChange={handleChange}
            className={fieldClassName}
            placeholder={label}
            onFocus={() => !locked && setFocussed(true)}
            onBlur={() => !locked && setFocussed(false)}
        />
    )
})

Input.displayName = 'Input'

const useInputEffect = (props: InputProps) => {
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
