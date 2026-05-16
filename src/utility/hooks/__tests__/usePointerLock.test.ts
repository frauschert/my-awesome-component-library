import { renderHook, act } from '@testing-library/react'
import usePointerLock from '../usePointerLock'

// ---------------------------------------------------------------------------
// Helpers to simulate the Pointer Lock API in JSDOM
// ---------------------------------------------------------------------------

let lockedElement: Element | null = null

const setupPointerLockMocks = () => {
    lockedElement = null

    Object.defineProperty(document, 'pointerLockElement', {
        get: () => lockedElement,
        configurable: true,
    })

    HTMLElement.prototype.requestPointerLock = jest.fn(function (
        this: HTMLElement
    ) {
        lockedElement = this
        document.dispatchEvent(new Event('pointerlockchange'))
    })

    document.exitPointerLock = jest.fn(() => {
        lockedElement = null
        document.dispatchEvent(new Event('pointerlockchange'))
    })
}

describe('usePointerLock', () => {
    let element: HTMLDivElement

    beforeEach(() => {
        element = document.createElement('div')
        document.body.appendChild(element)
        setupPointerLockMocks()
    })

    afterEach(() => {
        document.body.removeChild(element)
        jest.restoreAllMocks()
    })

    it('initialises with isLocked=false and zero movement', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        expect(result.current.isLocked).toBe(false)
        expect(result.current.movement).toEqual({ x: 0, y: 0 })
    })

    it('reports isSupported=true when API is available', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))
        expect(result.current.isSupported).toBe(true)
    })

    it('lock() calls requestPointerLock and sets isLocked=true', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })

        expect(element.requestPointerLock).toHaveBeenCalled()
        expect(result.current.isLocked).toBe(true)
    })

    it('unlock() calls exitPointerLock and sets isLocked=false', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })
        expect(result.current.isLocked).toBe(true)

        act(() => {
            result.current.unlock()
        })

        expect(document.exitPointerLock).toHaveBeenCalled()
        expect(result.current.isLocked).toBe(false)
    })

    it('toggle() locks when unlocked', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.toggle()
        })

        expect(result.current.isLocked).toBe(true)
    })

    it('toggle() unlocks when locked', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })
        act(() => {
            result.current.toggle()
        })

        expect(result.current.isLocked).toBe(false)
    })

    it('tracks movement deltas while locked', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })

        act(() => {
            const e = new MouseEvent('mousemove', { bubbles: true })
            Object.defineProperty(e, 'movementX', { value: 15 })
            Object.defineProperty(e, 'movementY', { value: -8 })
            document.dispatchEvent(e)
        })

        expect(result.current.movement).toEqual({ x: 15, y: -8 })
    })

    it('resets movement to {x:0,y:0} on unlock', () => {
        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })
        act(() => {
            const e = new MouseEvent('mousemove', { bubbles: true })
            Object.defineProperty(e, 'movementX', { value: 5 })
            Object.defineProperty(e, 'movementY', { value: 5 })
            document.dispatchEvent(e)
        })
        act(() => {
            result.current.unlock()
        })

        expect(result.current.movement).toEqual({ x: 0, y: 0 })
    })

    it('does not update movement when a different element holds the lock', () => {
        const other = document.createElement('div')
        document.body.appendChild(other)
        lockedElement = other // simulate another element holding the lock
        document.dispatchEvent(new Event('pointerlockchange'))

        const ref = { current: element }
        const { result } = renderHook(() => usePointerLock(ref))

        act(() => {
            const e = new MouseEvent('mousemove', { bubbles: true })
            Object.defineProperty(e, 'movementX', { value: 99 })
            Object.defineProperty(e, 'movementY', { value: 99 })
            document.dispatchEvent(e)
        })

        expect(result.current.movement).toEqual({ x: 0, y: 0 })
        document.body.removeChild(other)
    })

    it('fires onLock callback when lock is acquired', () => {
        const onLock = jest.fn()
        const ref = { current: element }
        renderHook(() => usePointerLock(ref, { onLock }))

        act(() => {
            lockedElement = element
            document.dispatchEvent(new Event('pointerlockchange'))
        })

        expect(onLock).toHaveBeenCalledTimes(1)
    })

    it('fires onUnlock callback when lock is released', () => {
        const onUnlock = jest.fn()
        const ref = { current: element }
        renderHook(() => usePointerLock(ref, { onUnlock }))

        act(() => {
            lockedElement = element
            document.dispatchEvent(new Event('pointerlockchange'))
        })
        act(() => {
            lockedElement = null
            document.dispatchEvent(new Event('pointerlockchange'))
        })

        expect(onUnlock).toHaveBeenCalledTimes(1)
    })

    it('fires onError callback on pointerlockerror', () => {
        const onError = jest.fn()
        const ref = { current: element }
        renderHook(() => usePointerLock(ref, { onError }))

        act(() => {
            document.dispatchEvent(new Event('pointerlockerror'))
        })

        expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('calls exitPointerLock on unmount if still locked', () => {
        const ref = { current: element }
        const { result, unmount } = renderHook(() => usePointerLock(ref))

        act(() => {
            result.current.lock()
        })
        expect(result.current.isLocked).toBe(true)

        unmount()
        expect(document.exitPointerLock).toHaveBeenCalled()
    })

    it('does not call exitPointerLock on unmount if not locked', () => {
        const ref = { current: element }
        const { unmount } = renderHook(() => usePointerLock(ref))
        const callCount = (document.exitPointerLock as jest.Mock).mock.calls
            .length

        unmount()
        expect((document.exitPointerLock as jest.Mock).mock.calls.length).toBe(
            callCount
        )
    })
})
