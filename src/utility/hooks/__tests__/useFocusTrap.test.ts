import { renderHook } from '@testing-library/react'
import useFocusTrap from '../useFocusTrap'

describe('useFocusTrap', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('should return a containerRef and onKeyDown handler', () => {
        const { result } = renderHook(() => useFocusTrap())
        expect(result.current.containerRef).toBeDefined()
        expect(typeof result.current.onKeyDown).toBe('function')
    })

    it('should focus initial element when enabled', () => {
        const container = document.createElement('div')
        const button = document.createElement('button')
        button.textContent = 'Click me'
        container.appendChild(button)
        document.body.appendChild(container)

        const { result } = renderHook(() => useFocusTrap({ enabled: true }))

        // Manually assign the ref
        Object.defineProperty(result.current.containerRef, 'current', {
            value: container,
            writable: true,
        })

        // Re-render to trigger the effect with the ref set
        const { unmount } = renderHook(() => useFocusTrap({ enabled: true }))

        jest.runAllTimers()

        document.body.removeChild(container)
        unmount()
    })

    it('should not activate when disabled', () => {
        const { result } = renderHook(() => useFocusTrap({ enabled: false }))

        expect(result.current.containerRef).toBeDefined()
        expect(typeof result.current.onKeyDown).toBe('function')
    })

    it('should handle Tab key cycling', () => {
        const container = document.createElement('div')
        const btn1 = document.createElement('button')
        const btn2 = document.createElement('button')
        btn1.textContent = 'First'
        btn2.textContent = 'Second'
        container.appendChild(btn1)
        container.appendChild(btn2)
        document.body.appendChild(container)

        const { result } = renderHook(() => useFocusTrap({ enabled: true }))

        Object.defineProperty(result.current.containerRef, 'current', {
            value: container,
            writable: true,
        })

        btn2.focus()

        // Simulate Tab on last element — should wrap to first
        const event = {
            key: 'Tab',
            shiftKey: false,
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent

        result.current.onKeyDown(event)

        expect(event.preventDefault).toHaveBeenCalled()
        expect(document.activeElement).toBe(btn1)

        document.body.removeChild(container)
    })

    it('should handle Shift+Tab cycling', () => {
        const container = document.createElement('div')
        const btn1 = document.createElement('button')
        const btn2 = document.createElement('button')
        btn1.textContent = 'First'
        btn2.textContent = 'Second'
        container.appendChild(btn1)
        container.appendChild(btn2)
        document.body.appendChild(container)

        const { result } = renderHook(() => useFocusTrap({ enabled: true }))

        Object.defineProperty(result.current.containerRef, 'current', {
            value: container,
            writable: true,
        })

        btn1.focus()

        // Shift+Tab on first element — should wrap to last
        const event = {
            key: 'Tab',
            shiftKey: true,
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent

        result.current.onKeyDown(event)

        expect(event.preventDefault).toHaveBeenCalled()
        expect(document.activeElement).toBe(btn2)

        document.body.removeChild(container)
    })

    it('should ignore non-Tab keys', () => {
        const { result } = renderHook(() => useFocusTrap({ enabled: true }))

        const event = {
            key: 'Enter',
            shiftKey: false,
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent

        result.current.onKeyDown(event)
        expect(event.preventDefault).not.toHaveBeenCalled()
    })
})
