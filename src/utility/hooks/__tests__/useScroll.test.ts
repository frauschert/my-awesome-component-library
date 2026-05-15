import { renderHook, act } from '@testing-library/react'
import useScroll from '../useScroll'

// Mutable state shared by the getter-based window property mocks.
const win = {
    scrollX: 0,
    scrollY: 0,
    innerWidth: 1024,
    innerHeight: 768,
    scrollWidth: 1024,
    scrollHeight: 3000,
}

const defineGetter = (obj: object, prop: string, get: () => number) => {
    Object.defineProperty(obj, prop, { get, configurable: true })
}

describe('useScroll (window)', () => {
    beforeAll(() => {
        defineGetter(window, 'scrollX', () => win.scrollX)
        defineGetter(window, 'scrollY', () => win.scrollY)
        defineGetter(window, 'innerWidth', () => win.innerWidth)
        defineGetter(window, 'innerHeight', () => win.innerHeight)
        defineGetter(
            document.documentElement,
            'scrollWidth',
            () => win.scrollWidth
        )
        defineGetter(
            document.documentElement,
            'scrollHeight',
            () => win.scrollHeight
        )
    })

    beforeEach(() => {
        win.scrollX = 0
        win.scrollY = 0
        win.innerWidth = 1024
        win.innerHeight = 768
        win.scrollWidth = 1024
        win.scrollHeight = 3000
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    const fireWindowScroll = (scrollX: number, scrollY: number) => {
        win.scrollX = scrollX
        win.scrollY = scrollY
        act(() => {
            window.dispatchEvent(new Event('scroll'))
        })
    }

    it('initialises with default state', () => {
        const { result } = renderHook(() => useScroll())
        expect(result.current.x).toBe(0)
        expect(result.current.y).toBe(0)
        expect(result.current.directionX).toBe('none')
        expect(result.current.directionY).toBe('none')
        expect(result.current.percentX).toBe(0)
        expect(result.current.percentY).toBe(0)
        expect(result.current.isAtTop).toBe(true)
        expect(result.current.isAtLeft).toBe(true)
    })

    it('updates position on scroll', () => {
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 500)

        expect(result.current.y).toBe(500)
        expect(result.current.x).toBe(0)
    })

    it('detects direction down', () => {
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 200)
        expect(result.current.directionY).toBe('down')
        expect(result.current.directionX).toBe('none')
    })

    it('detects direction up', () => {
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 300)
        fireWindowScroll(0, 100)
        expect(result.current.directionY).toBe('up')
    })

    it('detects direction right', () => {
        win.scrollWidth = 2000
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(200, 0)
        expect(result.current.directionX).toBe('right')
    })

    it('detects direction left', () => {
        win.scrollWidth = 2000
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(300, 0)
        fireWindowScroll(100, 0)
        expect(result.current.directionX).toBe('left')
    })

    it('calculates vertical percentage', () => {
        // scrollHeight=3000, innerHeight=768 → maxY=2232
        win.scrollHeight = 3000
        win.innerHeight = 768
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 1116) // half of maxY
        expect(result.current.percentY).toBe(50)
    })

    it('calculates horizontal percentage', () => {
        // scrollWidth=2024, innerWidth=1024 → maxX=1000
        win.scrollWidth = 2024
        win.innerWidth = 1024
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(500, 0)
        expect(result.current.percentX).toBe(50)
    })

    it('detects isAtBottom', () => {
        // scrollHeight=1768, innerHeight=768 → maxY=1000
        win.scrollHeight = 1768
        win.innerHeight = 768
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 1000)
        expect(result.current.isAtBottom).toBe(true)
        expect(result.current.isAtTop).toBe(false)
    })

    it('detects isAtTop after scrolling back', () => {
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 300)
        fireWindowScroll(0, 0)
        expect(result.current.isAtTop).toBe(true)
    })

    it('detects isAtRight', () => {
        win.scrollWidth = 2024
        win.innerWidth = 1024
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(1000, 0)
        expect(result.current.isAtRight).toBe(true)
        expect(result.current.isAtLeft).toBe(false)
    })

    it('reports percentY=0 when content does not overflow', () => {
        win.scrollHeight = 768
        win.innerHeight = 768
        const { result } = renderHook(() => useScroll())

        fireWindowScroll(0, 0)
        expect(result.current.percentY).toBe(0)
        expect(result.current.isAtBottom).toBe(true)
    })

    it('does not attach listeners when disabled', () => {
        const addEventListener = jest.spyOn(window, 'addEventListener')
        renderHook(() => useScroll(null, { enabled: false }))
        expect(
            addEventListener.mock.calls.filter(([e]) => e === 'scroll')
        ).toHaveLength(0)
        addEventListener.mockRestore()
    })

    it('removes listeners on unmount', () => {
        const removeEventListener = jest.spyOn(window, 'removeEventListener')
        const { unmount } = renderHook(() => useScroll())
        unmount()
        expect(
            removeEventListener.mock.calls.filter(([e]) => e === 'scroll')
        ).toHaveLength(1)
        removeEventListener.mockRestore()
    })

    it('throttles updates when throttleMs is set', () => {
        jest.useFakeTimers()
        const { result } = renderHook(() =>
            useScroll(null, { throttleMs: 100 })
        )

        act(() => {
            // Fire multiple scroll events rapidly
            win.scrollY = 100
            window.dispatchEvent(new Event('scroll'))
            win.scrollY = 200
            window.dispatchEvent(new Event('scroll'))
            win.scrollY = 300
            window.dispatchEvent(new Event('scroll'))
        })

        // State should not have updated yet (timer pending)
        expect(result.current.y).toBe(0)

        act(() => {
            jest.runAllTimers()
        })

        // After timer fires, state reflects latest position
        expect(result.current.y).toBe(300)
    })
})

describe('useScroll (element ref)', () => {
    let element: HTMLDivElement

    const defineElemProp = (prop: string, value: number) => {
        Object.defineProperty(element, prop, {
            value,
            writable: true,
            configurable: true,
        })
    }

    const setupElement = ({
        scrollLeft = 0,
        scrollTop = 0,
        scrollWidth = 1000,
        scrollHeight = 2000,
        clientWidth = 400,
        clientHeight = 600,
    } = {}) => {
        defineElemProp('scrollLeft', scrollLeft)
        defineElemProp('scrollTop', scrollTop)
        defineElemProp('scrollWidth', scrollWidth)
        defineElemProp('scrollHeight', scrollHeight)
        defineElemProp('clientWidth', clientWidth)
        defineElemProp('clientHeight', clientHeight)
    }

    const fireElementScroll = (scrollLeft: number, scrollTop: number) => {
        defineElemProp('scrollLeft', scrollLeft)
        defineElemProp('scrollTop', scrollTop)
        act(() => {
            element.dispatchEvent(new Event('scroll'))
        })
    }

    beforeEach(() => {
        element = document.createElement('div')
        document.body.appendChild(element)
        setupElement()
    })

    afterEach(() => {
        document.body.removeChild(element)
    })

    it('reads initial scroll position from element', () => {
        setupElement({ scrollTop: 50, scrollLeft: 10 })
        const ref = { current: element }
        const { result } = renderHook(() => useScroll(ref))

        expect(result.current.y).toBe(50)
        expect(result.current.x).toBe(10)
    })

    it('updates on element scroll event', () => {
        const ref = { current: element }
        const { result } = renderHook(() => useScroll(ref))

        fireElementScroll(0, 300)

        expect(result.current.y).toBe(300)
        expect(result.current.directionY).toBe('down')
    })

    it('calculates element scroll percentage', () => {
        // scrollHeight=2000, clientHeight=600 → maxY=1400
        setupElement({ scrollHeight: 2000, clientHeight: 600 })
        const ref = { current: element }
        const { result } = renderHook(() => useScroll(ref))

        fireElementScroll(0, 700) // 700/1400 = 50%
        expect(result.current.percentY).toBe(50)
    })

    it('detects isAtBottom for element', () => {
        // scrollHeight=1600, clientHeight=600 → maxY=1000
        setupElement({ scrollHeight: 1600, clientHeight: 600 })
        const ref = { current: element }
        const { result } = renderHook(() => useScroll(ref))

        fireElementScroll(0, 1000)
        expect(result.current.isAtBottom).toBe(true)
    })
})
