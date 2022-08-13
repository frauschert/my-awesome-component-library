/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks'
import useToggle from '../useToggle'

test('should use toggle', () => {
    const { result } = renderHook(() => useToggle())

    expect(result.current[0]).toBe(false)
    expect(typeof result.current[1]).toBe('function')
})

test('should toggle value', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
        result.current[1]()
    })

    expect(result.current[0]).toBe(true)
})
