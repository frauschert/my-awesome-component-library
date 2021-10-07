import React, { useState, useCallback, useEffect } from 'react'
import debounce from '../../utility/debounce'
import { InputProps } from './types'

const Input = (props: InputProps) => {
    const [value, setValue] = useState<typeof props.initialValue>()

    const debounceChange = useCallback(
        debounce((value: string | number) => {
            if (props.type === 'number' && typeof value === 'number') {
                props.onChange(value)
            } else if (props.type === 'text' && typeof value === 'string') {
                props.onChange(value)
            }
        }, 500),
        [props.type, props.onChange]
    )

    useEffect(() => {
        if (value !== undefined) {
            debounceChange(value)
        }
    }, [value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setValue(event.target.value)
    }
    return (
        <input
            value={value}
            defaultValue={props.initialValue}
            onChange={handleChange}
        ></input>
    )
}

export default Input
