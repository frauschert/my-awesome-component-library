/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks'
import useAsync from '../useAsync'

async function testFunction() {
    return new Promise<string>((resolve) =>
        setTimeout(() => resolve('success'), 500)
    )
}

test('should use async', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useAsync(testFunction, false)
    )

    expect(result.current.loading).toBe(false)
    expect(result.current.value).toBe(null)
    expect(result.current.error).toBe(null)

    act(() => {
        result.current.execute()
    })

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.value).toBe('success')
})
