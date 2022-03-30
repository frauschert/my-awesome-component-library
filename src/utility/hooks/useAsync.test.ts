/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks'
import useAsync from './useAsync'

async function testFunction() {
    return new Promise<string>((resolve) =>
        setTimeout(() => resolve('success'), 500)
    )
}

test('should use async', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useAsync(testFunction)
    )

    expect(result.current[0].loading).toBe(false)
    expect(result.current[0].data).toBe(null)
    expect(result.current[0].error).toBe(null)

    act(() => {
        result.current[1]()
    })

    expect(result.current[0].loading).toBe(true)

    await waitForNextUpdate()

    expect(result.current[0].loading).toBe(false)
    expect(result.current[0].data).toBe('success')
})
