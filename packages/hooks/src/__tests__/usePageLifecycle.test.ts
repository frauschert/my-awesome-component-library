import { act, renderHook } from '@testing-library/react'
import usePageLifecycle from '../usePageLifecycle'

let originalHidden: PropertyDescriptor | undefined
let originalVisibilityState: PropertyDescriptor | undefined
let originalWasDiscarded: PropertyDescriptor | undefined
let originalHasFocus: (() => boolean) | undefined

let hasFocusValue = true

function setDocumentVisibility(visible: boolean) {
    Object.defineProperty(document, 'hidden', {
        configurable: true,
        writable: true,
        value: !visible,
    })

    Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        writable: true,
        value: visible ? 'visible' : 'hidden',
    })
}

function emitPageTransition(type: 'pageshow' | 'pagehide', persisted: boolean) {
    const event = new Event(type) as Event & { persisted?: boolean }
    event.persisted = persisted
    window.dispatchEvent(event)
}

beforeEach(() => {
    originalHidden = Object.getOwnPropertyDescriptor(
        Document.prototype,
        'hidden'
    )
    originalVisibilityState = Object.getOwnPropertyDescriptor(
        Document.prototype,
        'visibilityState'
    )
    originalWasDiscarded = Object.getOwnPropertyDescriptor(
        document,
        'wasDiscarded'
    )
    originalHasFocus = document.hasFocus

    hasFocusValue = true
    document.hasFocus = jest.fn(() => hasFocusValue)

    setDocumentVisibility(true)

    Object.defineProperty(document, 'wasDiscarded', {
        configurable: true,
        writable: true,
        value: false,
    })
})

afterEach(() => {
    if (originalHidden) {
        Object.defineProperty(Document.prototype, 'hidden', originalHidden)
    }

    if (originalVisibilityState) {
        Object.defineProperty(
            Document.prototype,
            'visibilityState',
            originalVisibilityState
        )
    }

    if (originalWasDiscarded) {
        Object.defineProperty(document, 'wasDiscarded', originalWasDiscarded)
    } else {
        delete (document as Document & { wasDiscarded?: unknown }).wasDiscarded
    }

    if (originalHasFocus) {
        document.hasFocus = originalHasFocus
    }

    jest.clearAllMocks()
})

describe('usePageLifecycle', () => {
    it('initialises with an active lifecycle snapshot', () => {
        const { result } = renderHook(() => usePageLifecycle())

        expect(result.current.state).toBe('active')
        expect(result.current.visibilityState).toBe('visible')
        expect(result.current.isVisible).toBe(true)
        expect(result.current.isFocused).toBe(true)
        expect(result.current.isFrozen).toBe(false)
        expect(result.current.isActive).toBe(true)
        expect(result.current.isPassive).toBe(false)
        expect(result.current.persisted).toBe(null)
        expect(result.current.wasDiscarded).toBe(false)
        expect(result.current.lastEvent).toBe(null)
        expect(result.current.isSupported).toBe(true)
    })

    it('tracks focus and blur transitions', () => {
        const onFocus = jest.fn()
        const onBlur = jest.fn()
        const { result } = renderHook(() =>
            usePageLifecycle({ onFocus, onBlur })
        )

        act(() => {
            hasFocusValue = false
            window.dispatchEvent(new Event('blur'))
        })

        expect(result.current.state).toBe('passive')
        expect(result.current.isFocused).toBe(false)
        expect(result.current.isPassive).toBe(true)
        expect(result.current.lastEvent).toBe('blur')
        expect(onBlur).toHaveBeenCalledTimes(1)

        act(() => {
            hasFocusValue = true
            window.dispatchEvent(new Event('focus'))
        })

        expect(result.current.state).toBe('active')
        expect(result.current.isFocused).toBe(true)
        expect(result.current.isActive).toBe(true)
        expect(result.current.lastEvent).toBe('focus')
        expect(onFocus).toHaveBeenCalledTimes(1)
    })

    it('tracks visibility changes and fires show/hide callbacks', () => {
        const onChange = jest.fn()
        const onShow = jest.fn()
        const onHide = jest.fn()
        const { result } = renderHook(() =>
            usePageLifecycle({ onChange, onShow, onHide })
        )

        act(() => {
            setDocumentVisibility(false)
            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.state).toBe('hidden')
        expect(result.current.isVisible).toBe(false)
        expect(result.current.visibilityState).toBe('hidden')
        expect(result.current.lastEvent).toBe('visibilitychange')
        expect(onHide).toHaveBeenCalledWith(false)
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                state: 'hidden',
                isVisible: false,
            })
        )

        act(() => {
            setDocumentVisibility(true)
            document.dispatchEvent(new Event('visibilitychange'))
        })

        expect(result.current.state).toBe('active')
        expect(result.current.isVisible).toBe(true)
        expect(result.current.visibilityState).toBe('visible')
        expect(onShow).toHaveBeenCalledWith(false)
    })

    it('tracks freeze and resume transitions', () => {
        const onFreeze = jest.fn()
        const onResume = jest.fn()
        const { result } = renderHook(() =>
            usePageLifecycle({ onFreeze, onResume })
        )

        act(() => {
            document.dispatchEvent(new Event('freeze'))
        })

        expect(result.current.state).toBe('frozen')
        expect(result.current.isFrozen).toBe(true)
        expect(result.current.lastEvent).toBe('freeze')
        expect(onFreeze).toHaveBeenCalledTimes(1)

        act(() => {
            document.dispatchEvent(new Event('resume'))
        })

        expect(result.current.state).toBe('active')
        expect(result.current.isFrozen).toBe(false)
        expect(result.current.lastEvent).toBe('resume')
        expect(onResume).toHaveBeenCalledTimes(1)
    })

    it('tracks page transitions and persisted state', () => {
        const onShow = jest.fn()
        const onHide = jest.fn()
        const { result } = renderHook(() =>
            usePageLifecycle({ onShow, onHide })
        )

        act(() => {
            emitPageTransition('pagehide', true)
        })

        expect(result.current.state).toBe('hidden')
        expect(result.current.isVisible).toBe(false)
        expect(result.current.persisted).toBe(true)
        expect(result.current.lastEvent).toBe('pagehide')
        expect(onHide).toHaveBeenCalledWith(true)

        act(() => {
            hasFocusValue = true
            emitPageTransition('pageshow', true)
        })

        expect(result.current.state).toBe('active')
        expect(result.current.isVisible).toBe(true)
        expect(result.current.persisted).toBe(true)
        expect(result.current.lastEvent).toBe('pageshow')
        expect(onShow).toHaveBeenCalledWith(true)
    })

    it('exposes the discarded-page flag on initial state', () => {
        Object.defineProperty(document, 'wasDiscarded', {
            configurable: true,
            writable: true,
            value: true,
        })

        const { result } = renderHook(() => usePageLifecycle())

        expect(result.current.wasDiscarded).toBe(true)
    })
})
