import React, { useRef } from 'react'
import { render, act } from '@testing-library/react'
import useSize from '../useSize'

describe('useSize', () => {
    let instances: any[] = []

    beforeAll(() => {
        // Mock ResizeObserver on both global and window
        class MockResizeObserver {
            callback: (entries: any[]) => void
            constructor(callback: (entries: any[]) => void) {
                this.callback = callback
                instances.push(this)
            }
            observe() {}
            disconnect() {}
            trigger(entry: any) {
                this.callback([entry])
            }
        }
        ;(global as any).ResizeObserver = MockResizeObserver
        ;(window as any).ResizeObserver = MockResizeObserver
    })

    beforeEach(() => {
        instances = []
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
        const ref = useRef<HTMLDivElement>(null!)
        const size = useSize(ref)
        return (
            <div ref={ref} data-testid="box">
                {size ? `${size.width}x${size.height}` : 'no size'}
            </div>
        )
    }

    it('returns initial size after mount', () => {
        const { getByTestId } = render(<TestComponent />)
        expect(getByTestId('box').textContent).toBe('100x50')
    })

    it('updates size on resize (debounced)', async () => {
        const { getByTestId } = render(<TestComponent />)
        // Simulate resize event
        await act(async () => {
            instances[0].trigger({ contentRect: { width: 200, height: 80 } })
            await new Promise((res) => setTimeout(res, 120))
        })
        expect(getByTestId('box').textContent).toBe('200x80')
    })
})
