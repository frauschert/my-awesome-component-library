import { fireEvent, renderHook } from '@testing-library/react'
import useEventListener from '../useEventListener'

test('should attach and call event correctly', () => {
    const div = document.createElement('div')

    const handler = jest.fn()

    renderHook(() => useEventListener(div, 'click', handler))

    fireEvent.click(div)

    expect(handler).toHaveBeenCalledTimes(1)

    fireEvent.click(div)

    expect(handler).toHaveBeenCalledTimes(2)
})
