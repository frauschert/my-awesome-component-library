import React, { useCallback, useEffect, useState } from 'react'
import debounce from '../../utility/debounce'
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

    const [value, setValue] = useState<number>(initialValue ?? 0)
    useDebounce(() => onChange?.(value), 500, [onChange])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const targetValue = parseFloat(event.target.value)

        if (isNaN(targetValue)) {
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
        </>
    )
}

export default RangeInput
