import { renderHook } from '@testing-library/react'
import useBeforeUnload from '../useBeforeUnload'

describe('useBeforeUnload', () => {
    let addSpy: jest.SpyInstance
    let removeSpy: jest.SpyInstance

    beforeEach(() => {
        addSpy = jest.spyOn(window, 'addEventListener')
        removeSpy = jest.spyOn(window, 'removeEventListener')
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('registers a beforeunload listener on mount', () => {
        renderHook(() => useBeforeUnload(() => {}))

        expect(addSpy).toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
    })

    it('removes the beforeunload listener on unmount', () => {
        const { unmount } = renderHook(() => useBeforeUnload(() => {}))

        unmount()

        expect(removeSpy).toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
    })

    it('calls the handler when beforeunload fires', () => {
        const handler = jest.fn()
        renderHook(() => useBeforeUnload(handler))

        const event = new Event('beforeunload') as BeforeUnloadEvent
        window.dispatchEvent(event)

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(event)
    })

    it('does not register when enabled is false', () => {
        renderHook(() => useBeforeUnload(() => {}, { enabled: false }))

        expect(addSpy).not.toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
    })

    it('removes the listener when enabled changes to false', () => {
        const { rerender } = renderHook(
            ({ enabled }) => useBeforeUnload(() => {}, { enabled }),
            { initialProps: { enabled: true } }
        )

        expect(addSpy).toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )

        rerender({ enabled: false })

        expect(removeSpy).toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
    })

    it('adds the listener when enabled changes to true', () => {
        const { rerender } = renderHook(
            ({ enabled }) => useBeforeUnload(() => {}, { enabled }),
            { initialProps: { enabled: false } }
        )

        addSpy.mockClear()

        rerender({ enabled: true })

        expect(addSpy).toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
    })

    it('always calls the latest handler without re-registering', () => {
        const firstHandler = jest.fn()
        const secondHandler = jest.fn()

        const { rerender } = renderHook(
            ({ handler }) => useBeforeUnload(handler),
            { initialProps: { handler: firstHandler } }
        )

        addSpy.mockClear()
        removeSpy.mockClear()

        rerender({ handler: secondHandler })

        // Listener should NOT be re-registered when only the handler changes
        expect(addSpy).not.toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )
        expect(removeSpy).not.toHaveBeenCalledWith(
            'beforeunload',
            expect.any(Function)
        )

        // The latest handler should be invoked
        const event = new Event('beforeunload') as BeforeUnloadEvent
        window.dispatchEvent(event)

        expect(firstHandler).not.toHaveBeenCalled()
        expect(secondHandler).toHaveBeenCalledTimes(1)
    })

    it('supports event.preventDefault() to trigger the leave-site dialog', () => {
        renderHook(() =>
            useBeforeUnload((event) => {
                event.preventDefault()
            })
        )

        const event = new Event('beforeunload', {
            cancelable: true,
        }) as BeforeUnloadEvent
        window.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
    })
})
