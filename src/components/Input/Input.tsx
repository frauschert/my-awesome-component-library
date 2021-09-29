import React from 'react'
import { useDebounceCallback } from '../../utility/hooks/useDebounce'
import { InputProps } from './types'

function Input({ initialValue, onChange }: InputProps) {
    const [values, setValues] = useDebounceCallback(onChange, 500)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setValues(event.target.value)
    }
    return (
        <input
            value={values?.[0] ?? initialValue}
            onChange={handleChange}
        ></input>
    )
}

export default Input
