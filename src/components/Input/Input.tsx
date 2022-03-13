import React, { useState } from 'react'
import useDebounce from '../../utility/hooks/useDebounce'
import { InputProps, NumberInputProps, TextInputProps } from './types'

const Input = (props: InputProps) => {
    const { type } = props

    switch (type) {
        case 'number':
            return <NumberInput {...props} />
        case 'text':
            return <TextInput {...props} />
    }
}

const NumberInput = (props: NumberInputProps) => {
    const [value, setValue] = useInputEffect({ ...props })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(event.target.value)
        if (isNaN(parsedValue)) {
            return
        }

        setValue(parsedValue)
    }

    return <input type="number" value={value} onChange={handleChange} />
}

const TextInput = (props: TextInputProps) => {
    const [value, setValue] = useInputEffect({ ...props })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventValue = event.target.value

        setValue(eventValue)
    }

    return <input type="text" value={value} onChange={handleChange} />
}

const useInputEffect = (props: InputProps) => {
    const [value, setValue] = useState(props.initialValue ?? '')
    useDebounce(
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
