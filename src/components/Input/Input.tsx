import React, { useState } from 'react'
import useDebounce from '../../utility/hooks/useDebounce'
import useDidUpdate from '../../utility/hooks/useDidUpdate'
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
    const debouncedValue = useDebounce(value, 500)

    useDidUpdate(() => {
        if (props.type === 'number' && typeof debouncedValue === 'number') {
            props.onChange(debouncedValue)
        } else if (
            props.type === 'text' &&
            typeof debouncedValue === 'string'
        ) {
            props.onChange(debouncedValue)
        }
    }, [debouncedValue, props.type, props.onChange])

    return [value, setValue] as const
}

export default Input
