import { act, renderHook, waitFor } from '@testing-library/react'
import useTimeout from '../useTimeout'

test('should use timeout', async () => {
    const delay = 1000
    let executed = false
    renderHook(() => useTimeout(() => (executed = true), delay))

    await waitFor(
        () => {
            expect(executed).toBe(true)
        },
        { timeout: delay * 2 }
    )
})

test('should clear & reset timeout', async () => {
    const delay = 1000
    let executed = false
    const { result } = renderHook(() =>
        useTimeout(() => (executed = true), delay)
    )

    act(result.current.clear)

    await waitFor(
        () => {
            expect(executed).toBe(false)
        },
        { timeout: delay * 2 }
    )

    act(result.current.reset)

    await waitFor(
        () => {
            expect(executed).toBe(true)
        },
        { timeout: delay * 2 }
    )
})
