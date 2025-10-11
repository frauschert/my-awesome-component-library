import { renderHook, act } from '@testing-library/react'
import useKeyPress from '../useKeyPress'

describe('useKeyPress', () => {
    describe('basic functionality', () => {
        it('should return false initially', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))
            expect(result.current).toBe(false)
        })

        it('should return true when the key is pressed', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Enter' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should return false when the key is released', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Enter' })
                )
            })

            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keyup', { key: 'Enter' })
                )
            })

            expect(result.current).toBe(false)
        })

        it('should not respond to different keys', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' })
                )
            })

            expect(result.current).toBe(false)
        })

        it('should handle multiple key presses in sequence', () => {
            const { result } = renderHook(() => useKeyPress('a'))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
            })
            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(true)
        })
    })

    describe('multiple keys', () => {
        it('should accept an array of keys', () => {
            const { result } = renderHook(() => useKeyPress(['a', 'A']))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(true)
        })

        it('should respond to any key in the array', () => {
            const { result } = renderHook(() => useKeyPress(['a', 'A']))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }))
            })

            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }))
            })

            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(true)
        })

        it('should handle arrow keys', () => {
            const { result } = renderHook(() =>
                useKeyPress(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
            )

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'ArrowUp' })
                )
            })
            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keyup', { key: 'ArrowUp' })
                )
            })
            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'ArrowLeft' })
                )
            })
            expect(result.current).toBe(true)
        })
    })

    describe('special keys', () => {
        it('should handle Escape key', () => {
            const { result } = renderHook(() => useKeyPress('Escape'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should handle Enter key', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Enter' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should handle Space key', () => {
            const { result } = renderHook(() => useKeyPress(' '))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
            })

            expect(result.current).toBe(true)
        })

        it('should handle Tab key', () => {
            const { result } = renderHook(() => useKeyPress('Tab'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Tab' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should handle modifier keys', () => {
            const { result: shiftResult } = renderHook(() =>
                useKeyPress('Shift')
            )
            const { result: ctrlResult } = renderHook(() =>
                useKeyPress('Control')
            )
            const { result: altResult } = renderHook(() => useKeyPress('Alt'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Shift' })
                )
            })
            expect(shiftResult.current).toBe(true)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Control' })
                )
            })
            expect(ctrlResult.current).toBe(true)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Alt' })
                )
            })
            expect(altResult.current).toBe(true)
        })
    })

    describe('custom event target', () => {
        it('should listen to custom event target', () => {
            const customTarget = document.createElement('div')
            const { result } = renderHook(() => useKeyPress('a', customTarget))

            act(() => {
                customTarget.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'a' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should not respond to events on different targets', () => {
            const customTarget = document.createElement('div')
            const { result } = renderHook(() => useKeyPress('a', customTarget))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(false)
        })

        it('should handle document as target', () => {
            const { result } = renderHook(() => useKeyPress('b', document))

            act(() => {
                document.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'b' })
                )
            })

            expect(result.current).toBe(true)
        })
    })

    describe('dynamic key changes', () => {
        it('should update when targetKey changes', () => {
            const { result, rerender } = renderHook(
                ({ key }) => useKeyPress(key),
                { initialProps: { key: 'a' } }
            )

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
            })
            expect(result.current).toBe(false)

            // Change the target key
            rerender({ key: 'b' })

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
            })
            expect(result.current).toBe(true)
        })

        it('should update when switching between single and array keys', () => {
            const { result, rerender } = renderHook(
                ({ key }) => useKeyPress(key),
                { initialProps: { key: 'a' as string | string[] } }
            )

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
            })

            // Change to array
            rerender({ key: ['x', 'y'] })

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })
            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }))
            })
            expect(result.current).toBe(true)
        })
    })

    describe('practical use cases', () => {
        it('should work for modal dismiss on Escape', () => {
            const { result } = renderHook(() => useKeyPress('Escape'))

            // Simulate modal open, user presses Escape
            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' })
                )
            })

            expect(result.current).toBe(true) // Can trigger modal close
        })

        it('should work for form submission on Enter', () => {
            const { result } = renderHook(() => useKeyPress('Enter'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Enter' })
                )
            })

            expect(result.current).toBe(true) // Can trigger form submit
        })

        it('should work for keyboard navigation', () => {
            const { result: upPressed } = renderHook(() =>
                useKeyPress('ArrowUp')
            )
            const { result: downPressed } = renderHook(() =>
                useKeyPress('ArrowDown')
            )

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'ArrowUp' })
                )
            })
            expect(upPressed.current).toBe(true)
            expect(downPressed.current).toBe(false)

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keyup', { key: 'ArrowUp' })
                )
            })
            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'ArrowDown' })
                )
            })

            expect(upPressed.current).toBe(false)
            expect(downPressed.current).toBe(true)
        })

        it('should work for keyboard shortcuts (case-insensitive)', () => {
            const { result } = renderHook(() => useKeyPress(['s', 'S']))

            // User presses S (with Shift)
            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'S' }))
            })
            expect(result.current).toBe(true)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keyup', { key: 'S' }))
            })

            // User presses s (without Shift)
            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }))
            })
            expect(result.current).toBe(true)
        })

        it('should work for game controls (WASD)', () => {
            const { result: wPressed } = renderHook(() => useKeyPress('w'))
            const { result: aPressed } = renderHook(() => useKeyPress('a'))
            const { result: dPressed } = renderHook(() => useKeyPress('d'))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
            })
            expect(wPressed.current).toBe(true)
            expect(aPressed.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))
            })
            expect(wPressed.current).toBe(true)
            expect(dPressed.current).toBe(true)
        })
    })

    describe('cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
            const removeEventListenerSpy = jest.spyOn(
                window,
                'removeEventListener'
            )

            const { unmount } = renderHook(() => useKeyPress('Enter'))

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'keydown',
                expect.any(Function)
            )
            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'keyup',
                expect.any(Function)
            )

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'keydown',
                expect.any(Function)
            )
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'keyup',
                expect.any(Function)
            )

            addEventListenerSpy.mockRestore()
            removeEventListenerSpy.mockRestore()
        })

        it('should not leak memory with multiple rerenders', () => {
            const { rerender, unmount } = renderHook(
                ({ key }) => useKeyPress(key),
                { initialProps: { key: 'a' } }
            )

            // Multiple rerenders
            for (let i = 0; i < 10; i++) {
                rerender({ key: i % 2 === 0 ? 'a' : 'b' })
            }

            // Should still work correctly
            const { result } = renderHook(() => useKeyPress('a'))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(true)

            unmount()
        })
    })

    describe('edge cases', () => {
        it('should handle empty string key', () => {
            const { result } = renderHook(() => useKeyPress(''))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: '' }))
            })

            expect(result.current).toBe(true)
        })

        it('should handle empty array', () => {
            const { result } = renderHook(() => useKeyPress([]))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(false)
        })

        it('should handle numeric keys', () => {
            const { result } = renderHook(() => useKeyPress('1'))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
            })

            expect(result.current).toBe(true)
        })

        it('should handle function keys', () => {
            const { result } = renderHook(() => useKeyPress('F1'))

            act(() => {
                window.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'F1' })
                )
            })

            expect(result.current).toBe(true)
        })

        it('should be case-sensitive by default', () => {
            const { result } = renderHook(() => useKeyPress('a'))

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }))
            })

            expect(result.current).toBe(false)

            act(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
            })

            expect(result.current).toBe(true)
        })
    })
})
