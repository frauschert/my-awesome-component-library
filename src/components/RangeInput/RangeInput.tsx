import React, { useState } from 'react'
import useDebounce from '../../utility/hooks/useDebounce'

export type RangeInputProps = {
    initialValue?: number
    minValue: number
    maxValue: number
    stepValue?: number
    onChange?: (value: number) => void
}

const RangeInput = (props: RangeInputProps) => {
    const { initialValue, minValue, maxValue, stepValue, onChange } = props

    const [value, setValue] = useState(initialValue ?? 0)
    useDebounce(() => onChange?.(value), 500, [onChange])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const targetValue = parseFloat(event.target.value)

        if (
            isNaN(targetValue) ||
            targetValue < minValue ||
            targetValue > maxValue
        ) {
            return
        }

        setValue(targetValue)
    }

    return (
        <>
            <input
                type="range"
                min={minValue}
                max={maxValue}
                step={stepValue ?? 1}
                value={value}
                defaultValue={initialValue}
                onChange={handleChange}
            />
            <input
                type="number"
                onChange={handleChange}
                min={minValue}
                max={maxValue}
                value={value}
                defaultValue={initialValue}
            />
        </>
    )
}

export default RangeInput
