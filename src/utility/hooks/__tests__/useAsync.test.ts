/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import useAsync from '../useAsync'

async function testFunction() {
    return new Promise<string>((resolve) =>
        setTimeout(() => resolve('success'), 500)
    )
}

test('should use async', async () => {
    const { result } = renderHook(() => useAsync(testFunction, false))

    expect(result.current.loading).toBe(false)
    expect(result.current.value).toBe(null)
    expect(result.current.error).toBe(null)

    act(() => {
        result.current.execute()
    })

    expect(result.current.loading).toBe(true)

    await waitFor(
        () => {
            expect(result.current.loading).toBe(false)
            expect(result.current.value).toBe('success')
        },
        { timeout: 1000 }
    )
})
