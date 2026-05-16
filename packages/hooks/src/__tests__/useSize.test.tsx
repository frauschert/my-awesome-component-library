import React, { useRef, useState, RefObject } from 'react'
import { render, act } from '@testing-library/react'
import useSize from '../useSize'

describe('useSize', () => {
    let instances: any[] = []
    let disconnectSpy: jest.Mock

    beforeAll(() => {
        // Mock ResizeObserver on both global and window
        class MockResizeObserver {
            callback: (entries: any[]) => void
            constructor(callback: (entries: any[]) => void) {
                this.callback = callback
                instances.push(this)
            }
            observe() {}
            disconnect() {
                disconnectSpy()
            }
            trigger(entry: any) {
                this.callback([entry])
            }
        }
        ;(globalThis as any).ResizeObserver = MockResizeObserver
        ;(window as any).ResizeObserver = MockResizeObserver
    })

    beforeEach(() => {
        instances = []
        disconnectSpy = jest.fn()
        // Mock getBoundingClientRect before render
        Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                width: 100,
                height: 50,
                top: 0,
                left: 0,
                right: 100,
                bottom: 50,
                x: 0,
                y: 0,
                toJSON: () => {},
            }),
        })
    })

    function TestComponent() {
        const ref = useRef<HTMLElement>(null)
        const size = useSize(ref as RefObject<HTMLElement>)
        return (
            <div ref={ref as any} data-testid="box">
                {size ? `${size.width}x${size.height}` : 'no size'}
            </div>
        )
    }

    describe('basic functionality', () => {
        it('returns initial size after mount', () => {
            const { getByTestId } = render(<TestComponent />)
            expect(getByTestId('box').textContent).toBe('100x50')
        })

        it('returns undefined before element is mounted', () => {
            let capturedSize: { width: number; height: number } | undefined

            function TestComponent() {
                const ref = useRef<HTMLElement>(null)
                const size = useSize(ref as RefObject<HTMLElement>)
                capturedSize = size
                return <div>{size ? 'has size' : 'no size'}</div>
            }

            render(<TestComponent />)
            expect(capturedSize).toBeUndefined()
        })

        it('creates ResizeObserver instance', () => {
            render(<TestComponent />)
            expect(instances.length).toBe(1)
        })
    })

    describe('resize updates', () => {
        it('updates size on resize (debounced)', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 200, height: 80 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('box').textContent).toBe('200x80')
        })

        it('handles multiple rapid resize events', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                // Trigger multiple resizes rapidly
                instances[0].trigger({
                    contentRect: { width: 150, height: 60 },
                })
                instances[0].trigger({
                    contentRect: { width: 180, height: 70 },
                })
                instances[0].trigger({
                    contentRect: { width: 200, height: 80 },
                })
                // Wait for debounce
                await new Promise((res) => setTimeout(res, 120))
            })

            // Should only use the last resize value due to debouncing
            expect(getByTestId('box').textContent).toBe('200x80')
        })

        it('updates to various sizes correctly', async () => {
            const { getByTestId } = render(<TestComponent />)

            // First resize
            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 300, height: 150 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })
            expect(getByTestId('box').textContent).toBe('300x150')

            // Second resize
            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 400, height: 200 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })
            expect(getByTestId('box').textContent).toBe('400x200')
        })

        it('handles decimal dimensions', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 123.456, height: 78.901 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('box').textContent).toBe('123.456x78.901')
        })
    })

    describe('cleanup', () => {
        it('disconnects observer on unmount', () => {
            const { unmount } = render(<TestComponent />)

            expect(disconnectSpy).not.toHaveBeenCalled()

            unmount()

            expect(disconnectSpy).toHaveBeenCalledTimes(1)
        })

        it('cleans up on ref change', () => {
            function DynamicRefComponent() {
                const [useFirstRef, setUseFirstRef] = useState(true)
                const ref1 = useRef<HTMLElement>(null)
                const ref2 = useRef<HTMLElement>(null)
                const size = useSize(
                    (useFirstRef ? ref1 : ref2) as RefObject<HTMLElement>
                )

                return (
                    <div>
                        <div ref={ref1 as any} data-testid="box1">
                            Box 1
                        </div>
                        <div ref={ref2 as any} data-testid="box2">
                            Box 2
                        </div>
                        <button onClick={() => setUseFirstRef(false)}>
                            Switch
                        </button>
                        <div data-testid="size">
                            {size ? `${size.width}x${size.height}` : 'no size'}
                        </div>
                    </div>
                )
            }

            const { getByText } = render(<DynamicRefComponent />)

            const initialInstances = instances.length

            act(() => {
                getByText('Switch').click()
            })

            // Should have created a new observer
            expect(instances.length).toBeGreaterThan(initialInstances)
        })
    })

    describe('null ref handling', () => {
        it('handles null ref gracefully', () => {
            function NullRefComponent() {
                const ref = useRef<HTMLElement>(null)
                const size = useSize(ref as RefObject<HTMLElement>)
                return <div>{size ? 'has size' : 'no size'}</div>
            }

            const { container } = render(<NullRefComponent />)
            expect(container.textContent).toBe('no size')
        })

        it('handles ref change when element updates', async () => {
            function DynamicElementComponent() {
                const [showFirst, setShowFirst] = useState(true)
                const ref = useRef<HTMLElement>(null)
                const size = useSize(ref as RefObject<HTMLElement>)

                return (
                    <div>
                        {showFirst ? (
                            <div ref={ref as any} data-testid="box1">
                                First
                            </div>
                        ) : (
                            <div ref={ref as any} data-testid="box2">
                                Second
                            </div>
                        )}
                        <button onClick={() => setShowFirst(false)}>
                            Switch
                        </button>
                        <div data-testid="size">
                            {size ? `${size.width}x${size.height}` : 'no size'}
                        </div>
                    </div>
                )
            }

            const { getByTestId, getByText } = render(
                <DynamicElementComponent />
            )

            // Initial render should have size
            expect(getByTestId('size').textContent).toBe('100x50')

            // Switch to second element
            act(() => {
                getByText('Switch').click()
            })

            await act(async () => {
                await new Promise((res) => setTimeout(res, 50))
            })

            // Should still have size from second element
            expect(getByTestId('size').textContent).toBe('100x50')
        })
    })

    describe('ResizeObserver support', () => {
        it('handles missing ResizeObserver API gracefully', () => {
            const originalResizeObserver = (globalThis as any).ResizeObserver
            ;(globalThis as any).ResizeObserver = undefined

            function TestComponent() {
                const ref = useRef<HTMLElement>(null)
                const size = useSize(ref as RefObject<HTMLElement>)
                return (
                    <div ref={ref as any} data-testid="box">
                        {size ? `${size.width}x${size.height}` : 'no size'}
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            // Should still show initial size from getBoundingClientRect
            expect(getByTestId('box').textContent).toBe('100x50')

            // Restore
            ;(globalThis as any).ResizeObserver = originalResizeObserver
        })
    })

    describe('practical use cases', () => {
        it('works for responsive container', async () => {
            function ResponsiveContainer() {
                const containerRef = useRef<HTMLElement>(null)
                const size = useSize(containerRef as RefObject<HTMLElement>)

                return (
                    <div ref={containerRef as any} data-testid="container">
                        {size && size.width < 200
                            ? 'Mobile View'
                            : 'Desktop View'}
                    </div>
                )
            }

            const { getByTestId } = render(<ResponsiveContainer />)

            // Initial: 100px width (< 200) should show mobile
            expect(getByTestId('container').textContent).toBe('Mobile View')

            // Resize to wider
            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 300, height: 100 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('container').textContent).toBe('Desktop View')
        })

        it('works for aspect ratio calculations', async () => {
            function AspectRatioBox() {
                const boxRef = useRef<HTMLElement>(null)
                const size = useSize(boxRef as RefObject<HTMLElement>)

                const aspectRatio =
                    size && size.height > 0
                        ? (size.width / size.height).toFixed(2)
                        : 'N/A'

                return (
                    <div ref={boxRef as any} data-testid="aspect">
                        Aspect Ratio: {aspectRatio}
                    </div>
                )
            }

            const { getByTestId } = render(<AspectRatioBox />)

            // Initial: 100/50 = 2.00
            expect(getByTestId('aspect').textContent).toBe('Aspect Ratio: 2.00')

            // Change to square
            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 200, height: 200 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('aspect').textContent).toBe('Aspect Ratio: 1.00')
        })

        it('works for canvas sizing', async () => {
            function CanvasWrapper() {
                const wrapperRef = useRef<HTMLElement>(null)
                const size = useSize(wrapperRef as RefObject<HTMLElement>)

                return (
                    <div ref={wrapperRef as any} data-testid="wrapper">
                        {size && (
                            <canvas
                                width={size.width}
                                height={size.height}
                                data-testid="canvas"
                            />
                        )}
                    </div>
                )
            }

            const { getByTestId } = render(<CanvasWrapper />)

            const canvas = getByTestId('canvas') as HTMLCanvasElement
            expect(canvas.width).toBe(100)
            expect(canvas.height).toBe(50)

            // Resize
            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 400, height: 300 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(canvas.width).toBe(400)
            expect(canvas.height).toBe(300)
        })
    })

    describe('edge cases', () => {
        it('handles zero dimensions', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                instances[0].trigger({ contentRect: { width: 0, height: 0 } })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('box').textContent).toBe('0x0')
        })

        it('handles very large dimensions', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: 10000, height: 8000 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            expect(getByTestId('box').textContent).toBe('10000x8000')
        })

        it('handles negative dimensions gracefully', async () => {
            const { getByTestId } = render(<TestComponent />)

            await act(async () => {
                instances[0].trigger({
                    contentRect: { width: -100, height: -50 },
                })
                await new Promise((res) => setTimeout(res, 120))
            })

            // Should still update with whatever value is provided
            expect(getByTestId('box').textContent).toBe('-100x-50')
        })
    })
})
