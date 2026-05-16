import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import useFocusWithin from '../useFocusWithin'

describe('useFocusWithin', () => {
    let container: HTMLDivElement
    let input1: HTMLInputElement
    let input2: HTMLInputElement
    let outsideButton: HTMLButtonElement

    beforeEach(() => {
        // Set up DOM structure
        container = document.createElement('div')
        input1 = document.createElement('input')
        input2 = document.createElement('input')
        outsideButton = document.createElement('button')

        input1.id = 'input1'
        input2.id = 'input2'
        outsideButton.id = 'outside'

        container.appendChild(input1)
        container.appendChild(input2)
        document.body.appendChild(container)
        document.body.appendChild(outsideButton)
    })

    afterEach(() => {
        document.body.removeChild(container)
        document.body.removeChild(outsideButton)
    })

    it('should return false initially when no focus', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        expect(result.current).toBe(false)
    })

    it('should return true when element itself has focus', () => {
        container.tabIndex = 0

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            container.focus()
        })

        expect(result.current).toBe(true)
    })

    it('should return true when child element has focus', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            input1.focus()
        })

        expect(result.current).toBe(true)
    })

    it('should return true when switching focus between children', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            input1.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            input2.focus()
        })
        expect(result.current).toBe(true)
    })

    it('should return false when focus moves outside', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            input1.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            outsideButton.focus()
        })
        expect(result.current).toBe(false)
    })

    it('should detect initial focus state', () => {
        act(() => {
            input1.focus()
        })

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        expect(result.current).toBe(true)
    })

    it('should handle focus events on deeply nested elements', () => {
        const nestedDiv = document.createElement('div')
        const nestedInput = document.createElement('input')
        nestedDiv.appendChild(nestedInput)
        container.appendChild(nestedDiv)

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            nestedInput.focus()
        })

        expect(result.current).toBe(true)

        act(() => {
            outsideButton.focus()
        })

        expect(result.current).toBe(false)
    })

    it('should handle blur without relatedTarget', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            input1.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            const focusOutEvent = new FocusEvent('focusout', {
                bubbles: true,
                relatedTarget: null,
            })
            input1.dispatchEvent(focusOutEvent)
        })

        expect(result.current).toBe(false)
    })

    it('should handle null ref', () => {
        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useFocusWithin(ref)
        })

        expect(result.current).toBe(false)
    })

    it('should handle ref change', () => {
        const container2 = document.createElement('div')
        const input3 = document.createElement('input')
        container2.appendChild(input3)
        document.body.appendChild(container2)

        const { result, rerender } = renderHook(
            ({ targetRef }) => useFocusWithin(targetRef),
            {
                initialProps: { targetRef: { current: container } },
            }
        )

        act(() => {
            input1.focus()
        })
        expect(result.current).toBe(true)

        // Change ref to second container and blur old focus
        act(() => {
            input1.blur()
        })

        rerender({ targetRef: { current: container2 } })

        expect(result.current).toBe(false)

        act(() => {
            input3.focus()
        })
        expect(result.current).toBe(true)

        document.body.removeChild(container2)
    })

    it('should clean up event listeners on unmount', () => {
        const addEventListenerSpy = jest.spyOn(container, 'addEventListener')
        const removeEventListenerSpy = jest.spyOn(
            container,
            'removeEventListener'
        )

        const { unmount } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'focusin',
            expect.any(Function)
        )
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'focusout',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'focusin',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'focusout',
            expect.any(Function)
        )

        addEventListenerSpy.mockRestore()
        removeEventListenerSpy.mockRestore()
    })

    it('should handle rapid focus changes', () => {
        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        for (let i = 0; i < 10; i++) {
            act(() => {
                input1.focus()
            })
            expect(result.current).toBe(true)

            act(() => {
                input2.focus()
            })
            expect(result.current).toBe(true)
        }

        act(() => {
            outsideButton.focus()
        })
        expect(result.current).toBe(false)
    })

    it('should work with form elements', () => {
        const form = document.createElement('form')
        const formInput = document.createElement('input')
        const formButton = document.createElement('button')

        form.appendChild(formInput)
        form.appendChild(formButton)
        document.body.appendChild(form)

        const { result } = renderHook(() => {
            const ref = useRef(form)
            return useFocusWithin(ref)
        })

        act(() => {
            formInput.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            formButton.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            outsideButton.focus()
        })
        expect(result.current).toBe(false)

        document.body.removeChild(form)
    })

    it('should handle textarea and select elements', () => {
        const textarea = document.createElement('textarea')
        const select = document.createElement('select')

        container.appendChild(textarea)
        container.appendChild(select)

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            textarea.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            select.focus()
        })
        expect(result.current).toBe(true)

        act(() => {
            outsideButton.focus()
        })
        expect(result.current).toBe(false)
    })

    it('should handle contentEditable elements', () => {
        const contentEditable = document.createElement('div')
        contentEditable.contentEditable = 'true'
        contentEditable.tabIndex = 0 // Make it focusable
        container.appendChild(contentEditable)

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            contentEditable.focus()
        })

        expect(result.current).toBe(true)
    })

    it('should handle buttons', () => {
        const button = document.createElement('button')
        button.textContent = 'Click me'
        container.appendChild(button)

        const { result } = renderHook(() => {
            const ref = useRef(container)
            return useFocusWithin(ref)
        })

        act(() => {
            button.focus()
        })

        expect(result.current).toBe(true)
    })
})
