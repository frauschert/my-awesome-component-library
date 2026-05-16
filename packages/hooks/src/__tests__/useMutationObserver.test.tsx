import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import useMutationObserver from '../useMutationObserver'

describe('useMutationObserver', () => {
    let targetElement: HTMLDivElement

    beforeEach(() => {
        targetElement = document.createElement('div')
        document.body.appendChild(targetElement)
    })

    afterEach(() => {
        document.body.removeChild(targetElement)
    })

    it('observes child list mutations', () => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, { childList: true })
        })

        // Add a child
        const child = document.createElement('span')
        targetElement.appendChild(child)

        // Wait for mutation observer
        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const mutations = callback.mock.calls[0][0]
            expect(mutations[0].type).toBe('childList')
            expect(mutations[0].addedNodes.length).toBe(1)
        }, 10)
    })

    it('observes attribute mutations', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                attributes: true,
                attributeOldValue: true,
            })
        })

        // Change an attribute
        targetElement.setAttribute('data-test', 'value')

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const mutations = callback.mock.calls[0][0]
            expect(mutations[0].type).toBe('attributes')
            expect(mutations[0].attributeName).toBe('data-test')
            done()
        }, 10)
    })

    it('observes character data mutations', (done) => {
        const callback = jest.fn()
        const textNode = document.createTextNode('initial')
        targetElement.appendChild(textNode)

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                characterData: true,
                characterDataOldValue: true,
                subtree: true,
            })
        })

        // Change text content
        textNode.textContent = 'updated'

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const mutations = callback.mock.calls[0][0]
            expect(mutations[0].type).toBe('characterData')
            expect(mutations[0].oldValue).toBe('initial')
            done()
        }, 10)
    })

    it('filters attributes', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                attributes: true,
                attributeFilter: ['class'],
            })
        })

        // Change filtered attribute
        targetElement.className = 'test'

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()

            callback.mockClear()

            // Change non-filtered attribute (should not trigger)
            targetElement.setAttribute('data-test', 'value')

            setTimeout(() => {
                expect(callback).not.toHaveBeenCalled()
                done()
            }, 10)
        }, 10)
    })

    it('observes subtree mutations', (done) => {
        const callback = jest.fn()
        const child = document.createElement('div')
        targetElement.appendChild(child)

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                childList: true,
                subtree: true,
            })
        })

        // Add grandchild
        const grandchild = document.createElement('span')
        child.appendChild(grandchild)

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const mutations = callback.mock.calls[0][0]
            expect(mutations[0].type).toBe('childList')
            expect(mutations[0].target).toBe(child)
            done()
        }, 10)
    })

    it('can be disabled', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                childList: true,
                enabled: false,
            })
        })

        // Add a child
        const child = document.createElement('span')
        targetElement.appendChild(child)

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled()
            done()
        }, 20)
    })

    it('updates callback without reconnecting', (done) => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()

        const { rerender } = renderHook(
            ({ cb }) => {
                const ref = { current: targetElement }
                useMutationObserver(cb, ref, { childList: true })
            },
            { initialProps: { cb: callback1 } }
        )

        // Add child with first callback
        const child1 = document.createElement('span')
        targetElement.appendChild(child1)

        setTimeout(() => {
            expect(callback1).toHaveBeenCalled()
            expect(callback2).not.toHaveBeenCalled()

            callback1.mockClear()

            // Update callback
            rerender({ cb: callback2 })

            // Add another child with second callback
            const child2 = document.createElement('div')
            targetElement.appendChild(child2)

            setTimeout(() => {
                expect(callback1).not.toHaveBeenCalled()
                expect(callback2).toHaveBeenCalled()
                done()
            }, 10)
        }, 10)
    })

    it('disconnects on unmount', (done) => {
        const callback = jest.fn()

        const { unmount } = renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, { childList: true })
        })

        unmount()

        // Add child after unmount
        const child = document.createElement('span')
        targetElement.appendChild(child)

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled()
            done()
        }, 20)
    })

    it('handles null ref', () => {
        const callback = jest.fn()

        expect(() => {
            renderHook(() => {
                const ref = { current: null }
                useMutationObserver(callback, ref, { childList: true })
            })
        }).not.toThrow()
    })

    it('handles ref changes', (done) => {
        const callback = jest.fn()
        const element1 = document.createElement('div')
        const element2 = document.createElement('div')
        document.body.appendChild(element1)
        document.body.appendChild(element2)

        const { rerender } = renderHook(
            ({ target }) => {
                const ref = { current: target }
                useMutationObserver(callback, ref, { childList: true })
            },
            { initialProps: { target: element1 } }
        )

        // Add child to first element
        element1.appendChild(document.createElement('span'))

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1)
            callback.mockClear()

            // Change ref to second element
            rerender({ target: element2 })

            // Add child to second element
            element2.appendChild(document.createElement('span'))

            setTimeout(() => {
                expect(callback).toHaveBeenCalledTimes(1)

                // Add child to first element (should not trigger)
                element1.appendChild(document.createElement('div'))

                setTimeout(() => {
                    expect(callback).toHaveBeenCalledTimes(1)
                    document.body.removeChild(element1)
                    document.body.removeChild(element2)
                    done()
                }, 10)
            }, 10)
        }, 10)
    })

    it('handles multiple mutation types', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, {
                childList: true,
                attributes: true,
            })
        })

        // Trigger both mutations
        targetElement.setAttribute('data-test', 'value')
        targetElement.appendChild(document.createElement('span'))

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const mutations = callback.mock.calls[0][0]
            expect(mutations.length).toBeGreaterThan(0)
            done()
        }, 10)
    })

    it('receives observer instance in callback', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = { current: targetElement }
            useMutationObserver(callback, ref, { childList: true })
        })

        targetElement.appendChild(document.createElement('span'))

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            const observer = callback.mock.calls[0][1]
            expect(observer).toBeInstanceOf(global.MutationObserver)
            done()
        }, 10)
    })

    it('works with useRef hook', (done) => {
        const callback = jest.fn()

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(targetElement)
            useMutationObserver(callback, ref, { childList: true })
        })

        targetElement.appendChild(document.createElement('span'))

        setTimeout(() => {
            expect(callback).toHaveBeenCalled()
            done()
        }, 10)
    })

    it('handles enable/disable toggle', (done) => {
        const callback = jest.fn()

        const { rerender } = renderHook(
            ({ enabled }) => {
                const ref = { current: targetElement }
                useMutationObserver(callback, ref, {
                    childList: true,
                    enabled,
                })
            },
            { initialProps: { enabled: true } }
        )

        // Add child while enabled
        targetElement.appendChild(document.createElement('span'))

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1)
            callback.mockClear()

            // Disable
            rerender({ enabled: false })

            // Add child while disabled
            targetElement.appendChild(document.createElement('div'))

            setTimeout(() => {
                expect(callback).not.toHaveBeenCalled()

                // Re-enable
                rerender({ enabled: true })

                // Add child while re-enabled
                targetElement.appendChild(document.createElement('p'))

                setTimeout(() => {
                    expect(callback).toHaveBeenCalledTimes(1)
                    done()
                }, 10)
            }, 10)
        }, 10)
    })
})
