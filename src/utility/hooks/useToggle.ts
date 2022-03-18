import { useCallback, useState } from 'react'

export default function useToggle(defaultValue: boolean) {
    const [value, setValue] = useState(defaultValue)

    const toggle = useCallback(
        () => setValue((currentValue) => !currentValue),
        [setValue]
    )

    return [value, toggle]
}
