import React, { useCallback, useState } from 'react'
import debounce from '../../utility/debounce'

const forceNumber = (value: any) => {
    let num = Number(value)
    if (isNaN(num) || typeof num === 'undefined') {
        num = 0
    }
    return num
}

export type RangeInputProps = {
    initialValue?: number
    minValue: number
    maxValue: number
    stepValue?: number
    onChange?: (value: number) => void
}

const RangeInput = (props: RangeInputProps) => {
    const { initialValue, minValue, maxValue, stepValue, onChange } = props

    const [value, setValue] = useState<number>()
    const debounceValue = useCallback(
        debounce((value: number) => onChange?.(value), 500),
        [onChange]
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const eventValue = forceNumber(event.target.value)
        setValue(eventValue)
        debounceValue(eventValue)
    }

    return (
        <>
            <input
                type="range"
                min={minValue}
                max={maxValue}
                step={stepValue ?? 1}
                value={value ?? initialValue}
                onChange={handleChange}
            />
        </>
    )
}

export default RangeInput
