import { renderHook } from '@testing-library/react'
import { act } from 'react'
import useInterval from '../useInterval'

describe('useInterval', () => {
    it('should call callback after specified delay', () => {
        jest.useFakeTimers()
        const callback = jest.fn()
        const container = document.createElement('div')
        document.body.appendChild(container)

        const { unmount } = renderHook(() => useInterval(callback, 1000), {
            container,
        })

        expect(callback).not.toHaveBeenCalled()

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(callback).toHaveBeenCalledTimes(1)

        unmount()
        document.body.removeChild(container)
        jest.useRealTimers()
    })

    it('should call callback repeatedly at interval', () => {
        jest.useFakeTimers()
        const callback = jest.fn()
        const container = document.createElement('div')
        document.body.appendChild(container)

        const { unmount } = renderHook(() => useInterval(callback, 1000), {
            container,
        })

        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(callback).toHaveBeenCalledTimes(3)

        unmount()
        document.body.removeChild(container)
        jest.useRealTimers()
    })

    it('should not call callback when delay is null', () => {
        jest.useFakeTimers()
        const callback = jest.fn()
        const container = document.createElement('div')
        document.body.appendChild(container)

        const { unmount } = renderHook(() => useInterval(callback, null), {
            container,
        })

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        expect(callback).not.toHaveBeenCalled()

        unmount()
        document.body.removeChild(container)
        jest.useRealTimers()
    })

    it('should clear interval on unmount', () => {
        jest.useFakeTimers()
        const callback = jest.fn()
        const container = document.createElement('div')
        document.body.appendChild(container)

        const { unmount } = renderHook(() => useInterval(callback, 1000), {
            container,
        })

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(callback).toHaveBeenCalledTimes(1)

        unmount()

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        // Should not be called after unmount
        expect(callback).toHaveBeenCalledTimes(1)

        document.body.removeChild(container)
        jest.useRealTimers()
    })
})
