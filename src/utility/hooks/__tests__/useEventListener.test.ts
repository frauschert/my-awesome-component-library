import { act, renderHook } from '@testing-library/react'
import useEventListener from '../useEventListener'

test('should attach and call event correctly', () => {
    const div = document.createElement('div')

    const handler = jest.fn()

    renderHook(() => useEventListener(div, 'click', handler))

    act(() => {
        div.dispatchEvent(new Event('click'))
    })

    expect(handler).toHaveBeenCalledTimes(1)

    act(() => {
        div.dispatchEvent(new Event('click'))
    })

    expect(handler).toHaveBeenCalledTimes(2)
})
