import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from '../useStorage'

const TEST_KEY = 'key'
const TEST_VALUE = { test: 'test' }

test('should set localStorage with default value', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE))
    expect(result.current[0]).toEqual(TEST_VALUE)
})

test('should update and remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE))
    expect(result.current[0]).toEqual(TEST_VALUE)

    act(() => {
        result.current[1]({ test: 'updated' })
    })
    expect(result.current[0]).toEqual({ test: 'updated' })

    act(() => {
        result.current[2]()
    })
    expect(result.current[0]).toEqual(TEST_VALUE)
})
