import { renderHook, act } from '@testing-library/react'
import useDraggable from '../useDraggable'

describe('useDraggable', () => {
    let element: HTMLDivElement

    beforeEach(() => {
        element = document.createElement('div')
        element.style.width = '100px'
        element.style.height = '100px'
        document.body.appendChild(element)
    })

    afterEach(() => {
        document.body.removeChild(element)
    })

    it('should initialize with default position', () => {
        const { result } = renderHook(() => useDraggable())

        expect(result.current.position).toEqual({ x: 0, y: 0 })
        expect(result.current.isDragging).toBe(false)
    })

    it('should initialize with custom position', () => {
        const { result } = renderHook(() =>
            useDraggable({ initialPosition: { x: 100, y: 200 } })
        )

        expect(result.current.position).toEqual({ x: 100, y: 200 })
    })

    it('should provide a ref', () => {
        const { result } = renderHook(() => useDraggable())

        expect(result.current.ref).toBeDefined()
        expect(typeof result.current.ref).toBe('function')
    })

    it('should start dragging on mousedown', () => {
        const onDragStart = jest.fn()
        const { result } = renderHook(() => useDraggable({ onDragStart }))

        act(() => {
            result.current.ref(element)
        })

        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            clientX: 0,
            clientY: 0,
        })

        act(() => {
            element.dispatchEvent(mouseDownEvent)
        })

        expect(result.current.isDragging).toBe(true)
        expect(onDragStart).toHaveBeenCalledWith({ x: 0, y: 0 })
    })

    it('should update position on mousemove while dragging', () => {
        const onDrag = jest.fn()
        const { result } = renderHook(() => useDraggable({ onDrag }))

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Move mouse
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 50,
                    clientY: 100,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 50, y: 100 })
        expect(onDrag).toHaveBeenCalledWith({ x: 50, y: 100 })
    })

    it('should stop dragging on mouseup', () => {
        const onDragEnd = jest.fn()
        const { result } = renderHook(() => useDraggable({ onDragEnd }))

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // End drag
        act(() => {
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        })

        expect(result.current.isDragging).toBe(false)
        expect(onDragEnd).toHaveBeenCalledWith({ x: 0, y: 0 })
    })

    it('should not drag when disabled', () => {
        const { result } = renderHook(() => useDraggable({ disabled: true }))

        act(() => {
            result.current.ref(element)
        })

        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        expect(result.current.isDragging).toBe(false)
    })

    it('should constrain to x axis only', () => {
        const { result } = renderHook(() => useDraggable({ axis: 'x' }))

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Move in both directions
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 50,
                    clientY: 100,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 50, y: 0 })
    })

    it('should constrain to y axis only', () => {
        const { result } = renderHook(() => useDraggable({ axis: 'y' }))

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Move in both directions
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 50,
                    clientY: 100,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 0, y: 100 })
    })

    it('should snap to grid', () => {
        const { result } = renderHook(() => useDraggable({ grid: [20, 20] }))

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Move to 25, 35 - should snap to 20, 40
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 25,
                    clientY: 35,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 20, y: 40 })
    })

    it('should apply custom bounds', () => {
        const { result } = renderHook(() =>
            useDraggable({
                bounds: { left: 0, right: 100, top: 0, bottom: 100 },
            })
        )

        act(() => {
            result.current.ref(element)
        })

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Try to move beyond bounds
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 200,
                    clientY: 200,
                })
            )
        })

        expect(result.current.position.x).toBeLessThanOrEqual(100)
        expect(result.current.position.y).toBeLessThanOrEqual(100)
    })

    it('should reset position', () => {
        const { result } = renderHook(() =>
            useDraggable({ initialPosition: { x: 50, y: 50 } })
        )

        act(() => {
            result.current.setPosition({ x: 100, y: 100 })
        })

        expect(result.current.position).toEqual({ x: 100, y: 100 })

        act(() => {
            result.current.reset()
        })

        expect(result.current.position).toEqual({ x: 50, y: 50 })
    })

    it('should allow manual position update', () => {
        const { result } = renderHook(() => useDraggable())

        act(() => {
            result.current.setPosition({ x: 200, y: 300 })
        })

        expect(result.current.position).toEqual({ x: 200, y: 300 })
    })

    it('should handle touch events', () => {
        const onDragStart = jest.fn()
        const onDrag = jest.fn()
        const { result } = renderHook(() =>
            useDraggable({ onDragStart, onDrag })
        )

        act(() => {
            result.current.ref(element)
        })

        // Start touch
        act(() => {
            element.dispatchEvent(
                new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 0, clientY: 0 } as Touch],
                })
            )
        })

        expect(result.current.isDragging).toBe(true)
        expect(onDragStart).toHaveBeenCalled()

        // Move touch
        act(() => {
            document.dispatchEvent(
                new TouchEvent('touchmove', {
                    bubbles: true,
                    touches: [{ clientX: 50, clientY: 100 } as Touch],
                })
            )
        })

        expect(result.current.position).toEqual({ x: 50, y: 100 })
        expect(onDrag).toHaveBeenCalledWith({ x: 50, y: 100 })

        // End touch
        act(() => {
            document.dispatchEvent(
                new TouchEvent('touchend', { bubbles: true })
            )
        })

        expect(result.current.isDragging).toBe(false)
    })

    it('should ignore multi-touch', () => {
        const { result } = renderHook(() => useDraggable())

        act(() => {
            result.current.ref(element)
        })

        // Multi-touch
        act(() => {
            element.dispatchEvent(
                new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [
                        { clientX: 0, clientY: 0 } as Touch,
                        { clientX: 100, clientY: 100 } as Touch,
                    ],
                })
            )
        })

        expect(result.current.isDragging).toBe(false)
    })

    it('should respect handle selector', () => {
        const handle = document.createElement('div')
        handle.className = 'drag-handle'
        element.appendChild(handle)

        const { result } = renderHook(() =>
            useDraggable({ handle: '.drag-handle' })
        )

        act(() => {
            result.current.ref(element)
        })

        // Click on element (not handle) - should not drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        expect(result.current.isDragging).toBe(false)

        // Click on handle - should drag
        act(() => {
            handle.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        expect(result.current.isDragging).toBe(true)
    })

    it('should respect cancel selector', () => {
        const cancelElement = document.createElement('button')
        cancelElement.className = 'no-drag'
        element.appendChild(cancelElement)

        const { result } = renderHook(() =>
            useDraggable({ cancel: '.no-drag' })
        )

        act(() => {
            result.current.ref(element)
        })

        // Click on cancel element - should not drag
        act(() => {
            cancelElement.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        expect(result.current.isDragging).toBe(false)

        // Click on element - should drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        expect(result.current.isDragging).toBe(true)
    })

    it('should not update position when not dragging', () => {
        const { result } = renderHook(() => useDraggable())

        act(() => {
            result.current.ref(element)
        })

        // Move mouse without starting drag
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 50,
                    clientY: 100,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 0, y: 0 })
    })

    it('should cleanup event listeners on unmount', () => {
        const { result, unmount } = renderHook(() => useDraggable())

        act(() => {
            result.current.ref(element)
        })

        const removeEventListenerSpy = jest.spyOn(
            element,
            'removeEventListener'
        )

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mousedown',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchstart',
            expect.any(Function)
        )
    })

    it('should cleanup document listeners when dragging stops', () => {
        const { result } = renderHook(() => useDraggable())

        act(() => {
            result.current.ref(element)
        })

        const removeEventListenerSpy = jest.spyOn(
            document,
            'removeEventListener'
        )

        // Start drag
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 0,
                    clientY: 0,
                })
            )
        })

        // Stop drag
        act(() => {
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        })

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mouseup',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchmove',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchend',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchcancel',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })

    it('should handle touchcancel event', () => {
        const { result } = renderHook(() => useDraggable())

        act(() => {
            result.current.ref(element)
        })

        // Start touch
        act(() => {
            element.dispatchEvent(
                new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 0, clientY: 0 } as Touch],
                })
            )
        })

        expect(result.current.isDragging).toBe(true)

        // Cancel touch
        act(() => {
            document.dispatchEvent(
                new TouchEvent('touchcancel', { bubbles: true })
            )
        })

        expect(result.current.isDragging).toBe(false)
    })

    it('should maintain position from initial to drag', () => {
        const { result } = renderHook(() =>
            useDraggable({ initialPosition: { x: 100, y: 100 } })
        )

        act(() => {
            result.current.ref(element)
        })

        // Start drag at 100, 100
        act(() => {
            element.dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: 100,
                    clientY: 100,
                })
            )
        })

        // Move 50px right and down
        act(() => {
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: 150,
                    clientY: 150,
                })
            )
        })

        expect(result.current.position).toEqual({ x: 150, y: 150 })
    })
})
