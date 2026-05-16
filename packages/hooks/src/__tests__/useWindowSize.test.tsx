import { renderHook, act } from '@testing-library/react'
import useWindowSize from '../useWindowSize'

describe('useWindowSize', () => {
    const originalInnerWidth = window.innerWidth
    const originalInnerHeight = window.innerHeight

    beforeEach(() => {
        // Reset window size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        })
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        })
    })

    afterEach(() => {
        // Restore original values
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        })
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: originalInnerHeight,
        })
    })

    describe('basic functionality', () => {
        it('should return initial window size', () => {
            const { result } = renderHook(() => useWindowSize())

            expect(result.current.width).toBe(1024)
            expect(result.current.height).toBe(768)
        })

        it('should update size on window resize', () => {
            const { result } = renderHook(() => useWindowSize())

            expect(result.current.width).toBe(1024)
            expect(result.current.height).toBe(768)

            // Simulate window resize
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1920,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1080,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(1920)
            expect(result.current.height).toBe(1080)
        })

        it('should update multiple times', () => {
            const { result } = renderHook(() => useWindowSize())

            // First resize
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 800,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 600,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(800)
            expect(result.current.height).toBe(600)

            // Second resize
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1440,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 900,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(1440)
            expect(result.current.height).toBe(900)
        })
    })

    describe('cleanup', () => {
        it('should remove event listener on unmount', () => {
            const removeEventListenerSpy = jest.spyOn(
                window,
                'removeEventListener'
            )

            const { unmount } = renderHook(() => useWindowSize())

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'resize',
                expect.any(Function)
            )

            removeEventListenerSpy.mockRestore()
        })

        it('should not update after unmount', () => {
            const { result, unmount } = renderHook(() => useWindowSize())

            const initialWidth = result.current.width

            unmount()

            // Try to trigger resize after unmount
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 500,
                })
                window.dispatchEvent(new Event('resize'))
            })

            // Size should remain unchanged
            expect(result.current.width).toBe(initialWidth)
        })
    })

    describe('edge cases', () => {
        it('should handle very small window sizes', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 320,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 480,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(320)
            expect(result.current.height).toBe(480)
        })

        it('should handle very large window sizes', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 3840,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 2160,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(3840)
            expect(result.current.height).toBe(2160)
        })

        it('should handle portrait orientation', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 768,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1024,
                })
                window.dispatchEvent(new Event('resize'))
            })

            expect(result.current.width).toBe(768)
            expect(result.current.height).toBe(1024)
        })
    })

    describe('practical use cases', () => {
        it('should detect mobile viewport', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 375,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 667,
                })
                window.dispatchEvent(new Event('resize'))
            })

            const isMobile = result.current.width < 768
            expect(isMobile).toBe(true)
        })

        it('should detect tablet viewport', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 768,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1024,
                })
                window.dispatchEvent(new Event('resize'))
            })

            const isTablet =
                result.current.width >= 768 && result.current.width < 1024
            expect(isTablet).toBe(true)
        })

        it('should detect desktop viewport', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1920,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1080,
                })
                window.dispatchEvent(new Event('resize'))
            })

            const isDesktop = result.current.width >= 1024
            expect(isDesktop).toBe(true)
        })

        it('should calculate aspect ratio', () => {
            const { result } = renderHook(() => useWindowSize())

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1920,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1080,
                })
                window.dispatchEvent(new Event('resize'))
            })

            const aspectRatio = result.current.width / result.current.height
            expect(aspectRatio).toBeCloseTo(16 / 9, 2)
        })

        it('should determine orientation', () => {
            const { result } = renderHook(() => useWindowSize())

            // Landscape
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1024,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 768,
                })
                window.dispatchEvent(new Event('resize'))
            })

            let isLandscape = result.current.width > result.current.height
            expect(isLandscape).toBe(true)

            // Portrait
            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 768,
                })
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: 1024,
                })
                window.dispatchEvent(new Event('resize'))
            })

            isLandscape = result.current.width > result.current.height
            expect(isLandscape).toBe(false)
        })
    })
})
