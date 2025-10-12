import { renderHook, act } from '@testing-library/react'
import { RefObject } from 'react'
import useOnScreen from '../useOnScreen'

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]

    private callback: IntersectionObserverCallback
    public elements: Set<Element> = new Set()

    constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
    ) {
        this.callback = callback
        this.rootMargin = options?.rootMargin || '0px'
    }

    observe(element: Element) {
        this.elements.add(element)
    }

    unobserve(element: Element) {
        this.elements.delete(element)
    }

    disconnect() {
        this.elements.clear()
    }

    takeRecords(): IntersectionObserverEntry[] {
        return []
    }

    // Helper method to trigger intersection
    triggerIntersection(isIntersecting: boolean) {
        const entries: IntersectionObserverEntry[] = Array.from(
            this.elements
        ).map((element) => ({
            target: element,
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
            boundingClientRect: element.getBoundingClientRect(),
            intersectionRect: element.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now(),
        }))
        this.callback(entries, this)
    }
}

let observerInstance: MockIntersectionObserver | null = null

describe('useOnScreen', () => {
    beforeEach(() => {
        observerInstance = null
        window.IntersectionObserver = jest.fn((callback, options) => {
            observerInstance = new MockIntersectionObserver(callback, options)
            return observerInstance
        }) as unknown as typeof IntersectionObserver
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('basic functionality', () => {
        it('should return false initially', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref))

            expect(result.current).toBe(false)
        })

        it('should create IntersectionObserver on mount', () => {
            const ref: RefObject<HTMLElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref))

            expect(window.IntersectionObserver).toHaveBeenCalledTimes(1)
            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '0px' }
            )
        })

        it('should observe the element', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            renderHook(() => useOnScreen(ref))

            expect(observerInstance?.elements.has(element)).toBe(true)
        })

        it('should return true when element enters viewport', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref))

            expect(result.current).toBe(false)

            // Simulate intersection
            act(() => {
                observerInstance?.triggerIntersection(true)
            })

            expect(result.current).toBe(true)
        })

        it('should return false when element leaves viewport', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref))

            // Enter viewport
            act(() => {
                observerInstance?.triggerIntersection(true)
            })
            expect(result.current).toBe(true)

            // Leave viewport
            act(() => {
                observerInstance?.triggerIntersection(false)
            })
            expect(result.current).toBe(false)
        })

        it('should handle multiple intersection changes', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref))

            // Multiple enters and exits
            act(() => {
                observerInstance?.triggerIntersection(true)
            })
            expect(result.current).toBe(true)

            act(() => {
                observerInstance?.triggerIntersection(false)
            })
            expect(result.current).toBe(false)

            act(() => {
                observerInstance?.triggerIntersection(true)
            })
            expect(result.current).toBe(true)

            act(() => {
                observerInstance?.triggerIntersection(false)
            })
            expect(result.current).toBe(false)
        })
    })

    describe('rootMargin option', () => {
        it('should use default rootMargin of 0px', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '0px' }
            )
        })

        it('should accept custom rootMargin', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref, '100px'))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '100px' }
            )
        })

        it('should accept negative rootMargin', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref, '-50px'))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '-50px' }
            )
        })

        it('should accept complex rootMargin with multiple values', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref, '10px 20px 30px 40px'))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '10px 20px 30px 40px' }
            )
        })

        it('should recreate observer when rootMargin changes', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            const { rerender } = renderHook(
                ({ margin }) => useOnScreen(ref, margin),
                { initialProps: { margin: '0px' } }
            )

            expect(window.IntersectionObserver).toHaveBeenCalledTimes(1)

            rerender({ margin: '100px' })

            expect(window.IntersectionObserver).toHaveBeenCalledTimes(2)
            expect(window.IntersectionObserver).toHaveBeenLastCalledWith(
                expect.any(Function),
                { rootMargin: '100px' }
            )
        })
    })

    describe('ref changes', () => {
        it('should handle null ref initially', () => {
            const ref: RefObject<HTMLDivElement | null> = { current: null }

            const { result } = renderHook(() =>
                useOnScreen(ref as RefObject<HTMLElement>)
            )

            expect(result.current).toBe(false)
        })

        it('should not observe when ref.current is null', () => {
            const ref: RefObject<HTMLDivElement | null> = { current: null }

            renderHook(() => useOnScreen(ref as RefObject<HTMLElement>))

            // No observer should be created
            expect(observerInstance).toBeNull()
        })
    })

    describe('cleanup', () => {
        it('should unobserve element on unmount', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }
            const unobserveSpy = jest.spyOn(
                MockIntersectionObserver.prototype,
                'unobserve'
            )

            const { unmount } = renderHook(() => useOnScreen(ref))

            expect(observerInstance?.elements.has(element)).toBe(true)

            unmount()

            expect(unobserveSpy).toHaveBeenCalledWith(element)

            unobserveSpy.mockRestore()
        })

        it('should handle unmount when ref is null', () => {
            const ref: RefObject<HTMLDivElement | null> = { current: null }

            const { unmount } = renderHook(() =>
                useOnScreen(ref as RefObject<HTMLElement>)
            )

            // Should not throw
            expect(() => unmount()).not.toThrow()
        })

        it('should cleanup on rootMargin change', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { rerender } = renderHook(
                ({ margin }) => useOnScreen(ref, margin),
                { initialProps: { margin: '0px' } }
            )

            const firstObserver = observerInstance
            expect(firstObserver?.rootMargin).toBe('0px')

            // Change rootMargin
            rerender({ margin: '100px' })

            // New observer should be created with new rootMargin
            expect(observerInstance).not.toBe(firstObserver)
            expect(observerInstance?.rootMargin).toBe('100px')
        })
    })

    describe('practical use cases', () => {
        it('should work for lazy loading images', () => {
            const imgElement = document.createElement('img')
            const ref: RefObject<HTMLImageElement> = { current: imgElement }

            const { result } = renderHook(() => useOnScreen(ref, '200px'))

            expect(result.current).toBe(false)

            // Image enters viewport (with 200px buffer)
            act(() => {
                observerInstance?.triggerIntersection(true)
            })

            expect(result.current).toBe(true)
            // At this point, you would load the actual image
        })

        it('should work for scroll animations', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref, '0px'))

            expect(result.current).toBe(false)

            // Element enters viewport
            act(() => {
                observerInstance?.triggerIntersection(true)
            })

            expect(result.current).toBe(true)
            // At this point, you would trigger animation
        })

        it('should work for infinite scroll trigger', () => {
            const sentinelElement = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: sentinelElement }

            const { result } = renderHook(() => useOnScreen(ref, '500px'))

            expect(result.current).toBe(false)

            // Sentinel enters viewport (500px before visible)
            act(() => {
                observerInstance?.triggerIntersection(true)
            })

            expect(result.current).toBe(true)
            // At this point, you would load more items
        })

        it('should work for analytics tracking', () => {
            const adElement = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: adElement }

            const { result } = renderHook(() => useOnScreen(ref, '0px'))

            expect(result.current).toBe(false)

            // Ad becomes visible
            act(() => {
                observerInstance?.triggerIntersection(true)
            })

            expect(result.current).toBe(true)
            // At this point, you would track impression
        })

        it('should work for video autoplay', () => {
            const videoElement = document.createElement('video')
            const ref: RefObject<HTMLVideoElement> = { current: videoElement }

            const { result } = renderHook(() => useOnScreen(ref, '0px'))

            // Video enters viewport
            act(() => {
                observerInstance?.triggerIntersection(true)
            })
            expect(result.current).toBe(true)
            // Play video

            // Video leaves viewport
            act(() => {
                observerInstance?.triggerIntersection(false)
            })
            expect(result.current).toBe(false)
            // Pause video
        })
    })

    describe('edge cases', () => {
        it('should handle rapid intersection changes', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            const { result } = renderHook(() => useOnScreen(ref))

            // Rapid changes
            for (let i = 0; i < 10; i++) {
                act(() => {
                    observerInstance?.triggerIntersection(i % 2 === 0)
                })
                expect(result.current).toBe(i % 2 === 0)
            }
        })

        it('should handle percentage-based rootMargin', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref, '50%'))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '50%' }
            )
        })

        it('should handle mixed unit rootMargin', () => {
            const ref: RefObject<HTMLDivElement> = {
                current: document.createElement('div'),
            }

            renderHook(() => useOnScreen(ref, '10% 20px'))

            expect(window.IntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                { rootMargin: '10% 20px' }
            )
        })
    })

    describe('performance', () => {
        it('should not create multiple observers for same element', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }

            renderHook(() => useOnScreen(ref))

            expect(window.IntersectionObserver).toHaveBeenCalledTimes(1)
        })

        it('should handle multiple hooks with different elements', () => {
            const element1 = document.createElement('div')
            const element2 = document.createElement('div')
            const ref1: RefObject<HTMLDivElement> = { current: element1 }
            const ref2: RefObject<HTMLDivElement> = { current: element2 }

            renderHook(() => useOnScreen(ref1))
            renderHook(() => useOnScreen(ref2))

            expect(window.IntersectionObserver).toHaveBeenCalledTimes(2)
        })

        it('should not re-observe on unrelated rerenders', () => {
            const element = document.createElement('div')
            const ref: RefObject<HTMLDivElement> = { current: element }
            const observeSpy = jest.spyOn(
                MockIntersectionObserver.prototype,
                'observe'
            )

            const { rerender } = renderHook(() => useOnScreen(ref, '0px'))

            const initialCallCount = observeSpy.mock.calls.length

            // Rerender with same props
            rerender()

            expect(observeSpy).toHaveBeenCalledTimes(initialCallCount)

            observeSpy.mockRestore()
        })
    })
})
