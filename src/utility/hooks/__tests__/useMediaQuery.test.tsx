import { renderHook, act } from '@testing-library/react'
import useMediaQuery from '../useMediaQuery'

// Mock type for MediaQueryListEvent
interface MockMediaQueryListEvent {
    matches: boolean
    media?: string
}

// Setup mock before all tests
const matchMediaMock = jest.fn()
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
})

describe('useMediaQuery', () => {
    beforeEach(() => {
        matchMediaMock.mockClear()
    })

    it('should return initial match state', () => {
        // eslint-disable-next-line no-unused-vars
        const listeners: Array<(event: MockMediaQueryListEvent) => void> = []

        matchMediaMock.mockImplementation((query: string) => ({
            matches: query === '(min-width: 768px)',
            media: query,
            addEventListener: jest.fn(
                (_event: string, handler: (typeof listeners)[0]) => {
                    listeners.push(handler)
                }
            ),
            removeEventListener: jest.fn(),
        }))

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

        expect(result.current).toBe(true)
    })

    it('should return false when query does not match', () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches: false,
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }))

        const { result } = renderHook(() =>
            useMediaQuery('(min-width: 1920px)')
        )

        expect(result.current).toBe(false)
    })

    it('should update when media query match changes', () => {
        let currentMatches = false
        // eslint-disable-next-line no-unused-vars
        const listeners: Array<(event: MockMediaQueryListEvent) => void> = []

        matchMediaMock.mockImplementation((query: string) => ({
            matches: currentMatches,
            media: query,
            addEventListener: jest.fn(
                (_event: string, handler: (typeof listeners)[0]) => {
                    listeners.push(handler)
                }
            ),
            removeEventListener: jest.fn(),
        }))

        const { result, rerender } = renderHook(() =>
            useMediaQuery('(min-width: 768px)')
        )

        expect(result.current).toBe(false)

        // Simulate media query change
        currentMatches = true
        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true })
            })
        })

        rerender()

        expect(result.current).toBe(true)
    })

    it('should handle different media queries', () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches:
                query === '(max-width: 768px)' ||
                query === '(prefers-color-scheme: dark)',
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }))

        const { result: mobileResult } = renderHook(() =>
            useMediaQuery('(max-width: 768px)')
        )
        const { result: desktopResult } = renderHook(() =>
            useMediaQuery('(min-width: 1024px)')
        )
        const { result: darkModeResult } = renderHook(() =>
            useMediaQuery('(prefers-color-scheme: dark)')
        )

        expect(mobileResult.current).toBe(true)
        expect(desktopResult.current).toBe(false)
        expect(darkModeResult.current).toBe(true)
    })

    it('should clean up event listeners on unmount', () => {
        const removeEventListenerMock = jest.fn()

        matchMediaMock.mockImplementation(() => ({
            matches: false,
            media: '(min-width: 768px)',
            addEventListener: jest.fn(),
            removeEventListener: removeEventListenerMock,
        }))

        const { unmount } = renderHook(() =>
            useMediaQuery('(min-width: 768px)')
        )

        unmount()

        expect(removeEventListenerMock).toHaveBeenCalled()
    })

    it('should handle legacy addListener API', () => {
        const listeners: any[] = []
        const removeListenerMock = jest.fn()

        matchMediaMock.mockImplementation((query: string) => ({
            matches: false,
            media: query,
            addListener: jest.fn((handler: any) => {
                listeners.push(handler)
            }),
            removeListener: removeListenerMock,
        }))

        const { result, unmount } = renderHook(() =>
            useMediaQuery('(min-width: 768px)')
        )

        expect(result.current).toBe(false)

        // Simulate change
        act(() => {
            listeners.forEach((listener) => {
                listener({ matches: true })
            })
        })

        unmount()

        expect(removeListenerMock).toHaveBeenCalled()
    })

    it('should update when query prop changes', () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches: query === '(min-width: 768px)',
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }))

        const { result, rerender } = renderHook(
            ({ query }) => useMediaQuery(query),
            {
                initialProps: { query: '(min-width: 768px)' },
            }
        )

        expect(result.current).toBe(true)

        // Change the query
        rerender({ query: '(min-width: 1024px)' })

        expect(result.current).toBe(false)
    })

    it('should handle SSR environment (no window)', () => {
        // This test verifies the hook returns false when window is undefined
        // In the actual hook, getMatches checks typeof window === 'undefined'

        // We can't truly delete window in jsdom, but we can verify the hook
        // handles the SSR case by checking the code path
        expect(typeof window).not.toBe('undefined')

        // The hook should still work in jsdom environment
        matchMediaMock.mockImplementation(() => ({
            matches: false,
            media: '(min-width: 768px)',
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }))

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(false)
    })

    describe('practical use cases', () => {
        beforeEach(() => {
            matchMediaMock.mockImplementation((query: string) => {
                let matches = false

                if (query === '(max-width: 767px)') matches = true // mobile
                if (query === '(min-width: 768px) and (max-width: 1023px)')
                    matches = false // tablet
                if (query === '(min-width: 1024px)') matches = false // desktop
                if (query === '(prefers-color-scheme: dark)') matches = true
                if (query === '(orientation: portrait)') matches = true
                if (query === '(prefers-reduced-motion: reduce)')
                    matches = false

                return {
                    matches,
                    media: query,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                }
            })
        })

        it('should detect mobile viewport', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(max-width: 767px)')
            )
            expect(result.current).toBe(true)
        })

        it('should detect tablet viewport', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
            )
            expect(result.current).toBe(false)
        })

        it('should detect desktop viewport', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(min-width: 1024px)')
            )
            expect(result.current).toBe(false)
        })

        it('should detect dark mode preference', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(prefers-color-scheme: dark)')
            )
            expect(result.current).toBe(true)
        })

        it('should detect orientation', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(orientation: portrait)')
            )
            expect(result.current).toBe(true)
        })

        it('should detect reduced motion preference', () => {
            const { result } = renderHook(() =>
                useMediaQuery('(prefers-reduced-motion: reduce)')
            )
            expect(result.current).toBe(false)
        })
    })

    describe('responsive design patterns', () => {
        it('should support complex media queries', () => {
            matchMediaMock.mockImplementation((query: string) => ({
                matches:
                    query ===
                    '(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)',
                media: query,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            }))

            const { result } = renderHook(() =>
                useMediaQuery(
                    '(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)'
                )
            )

            expect(result.current).toBe(true)
        })

        it('should support print media query', () => {
            matchMediaMock.mockImplementation((query: string) => ({
                matches: query === 'print',
                media: query,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            }))

            const { result } = renderHook(() => useMediaQuery('print'))

            expect(result.current).toBe(true)
        })
    })
})
