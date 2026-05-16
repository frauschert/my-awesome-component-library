import { renderHook, waitFor } from '@testing-library/react'
import useDebounceEffect from '../useDebounceEffect'

test('should use debounce', async () => {
    const delay = 1000
    let executed = false
    const { rerender } = renderHook(
        ({ initialValue }) =>
            useDebounceEffect(() => (executed = true), delay, [initialValue]),
        { initialProps: { initialValue: 0 } }
    )

    // debounce callback should not fire
    await waitFor(
        () => {
            expect(executed).toBe(false)
        },
        { timeout: delay * 2 }
    )

    rerender({ initialValue: 10 })

    // after value change debounce callback will fire
    await waitFor(
        () => {
            expect(executed).toBe(true)
        },
        { timeout: delay * 2 }
    )
})
