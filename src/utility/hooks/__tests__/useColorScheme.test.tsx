import { renderHook, act } from '@testing-library/react'
import useColorScheme from '../useColorScheme'

describe('useColorScheme', () => {
    let matchMediaMock: jest.Mock
    let listeners: ((e: MediaQueryListEvent) => void)[] = []

    beforeEach(() => {
        listeners = []
        matchMediaMock = jest.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: jest.fn(
                (event: string, handler: (e: MediaQueryListEvent) => void) => {
                    if (event === 'change') {
                        listeners.push(handler)
                    }
                }
            ),
            removeEventListener: jest.fn(
                (event: string, handler: (e: MediaQueryListEvent) => void) => {
                    if (event === 'change') {
                        listeners = listeners.filter((l) => l !== handler)
                    }
                }
            ),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: matchMediaMock,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        listeners = []
    })

    it('returns "light" as default when prefers-color-scheme is not dark', () => {
        const { result } = renderHook(() => useColorScheme())
        expect(result.current).toBe('light')
    })

    it('returns "dark" when prefers-color-scheme: dark is detected', () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addEventListener: jest.fn(
                (event: string, handler: (e: MediaQueryListEvent) => void) => {
                    if (event === 'change') {
                        listeners.push(handler)
                    }
                }
            ),
            removeEventListener: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))

        const { result } = renderHook(() => useColorScheme())
        expect(result.current).toBe('dark')
    })

    it('updates when color scheme preference changes to dark', () => {
        const { result } = renderHook(() => useColorScheme())

        expect(result.current).toBe('light')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true } as MediaQueryListEvent)
            })
        })

        expect(result.current).toBe('dark')
    })

    it('updates when color scheme preference changes to light', () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addEventListener: jest.fn(
                (event: string, handler: (e: MediaQueryListEvent) => void) => {
                    if (event === 'change') {
                        listeners.push(handler)
                    }
                }
            ),
            removeEventListener: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))

        const { result } = renderHook(() => useColorScheme())

        expect(result.current).toBe('dark')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: false } as MediaQueryListEvent)
            })
        })

        expect(result.current).toBe('light')
    })

    it('handles multiple rapid changes', () => {
        const { result } = renderHook(() => useColorScheme())

        expect(result.current).toBe('light')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true } as MediaQueryListEvent)
            })
        })
        expect(result.current).toBe('dark')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: false } as MediaQueryListEvent)
            })
        })
        expect(result.current).toBe('light')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true } as MediaQueryListEvent)
            })
        })
        expect(result.current).toBe('dark')
    })

    it('cleans up event listener on unmount', () => {
        const removeEventListenerSpy = jest.fn()
        matchMediaMock.mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: jest.fn(),
            removeEventListener: removeEventListenerSpy,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))

        const { unmount } = renderHook(() => useColorScheme())

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
    })

    it('uses addListener/removeListener for legacy browsers', () => {
        const addListenerSpy = jest.fn()
        const removeListenerSpy = jest.fn()

        matchMediaMock.mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: undefined,
            removeEventListener: undefined,
            addListener: addListenerSpy,
            removeListener: removeListenerSpy,
            dispatchEvent: jest.fn(),
        }))

        const { unmount } = renderHook(() => useColorScheme())

        expect(addListenerSpy).toHaveBeenCalledWith(expect.any(Function))

        unmount()

        expect(removeListenerSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('returns "light" when matchMedia is not supported', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: undefined,
        })

        const { result } = renderHook(() => useColorScheme())
        expect(result.current).toBe('light')
    })

    it('registers event listener with correct query', () => {
        const { result } = renderHook(() => useColorScheme())

        expect(matchMediaMock).toHaveBeenCalledWith(
            '(prefers-color-scheme: dark)'
        )
        expect(result.current).toBe('light')
    })

    it('handles system theme changes during component lifecycle', () => {
        const { result, rerender } = renderHook(() => useColorScheme())

        expect(result.current).toBe('light')

        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true } as MediaQueryListEvent)
            })
        })

        expect(result.current).toBe('dark')

        rerender()

        expect(result.current).toBe('dark')
    })

    it('maintains state across re-renders without system changes', () => {
        const { result, rerender } = renderHook(() => useColorScheme())

        expect(result.current).toBe('light')

        rerender()
        rerender()
        rerender()

        expect(result.current).toBe('light')
    })

    it('handles SSR environment gracefully', () => {
        const originalMatchMedia = window.matchMedia

        // @ts-expect-error - Simulating SSR/old browser
        window.matchMedia = undefined

        const { result } = renderHook(() => useColorScheme())
        expect(result.current).toBe('light')

        window.matchMedia = originalMatchMedia
    })
})
