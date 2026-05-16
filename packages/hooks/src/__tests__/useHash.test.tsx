import React, { useEffect } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import useHash from '../useHash'

describe('useHash', () => {
    beforeEach(() => {
        // Reset hash before each test
        window.location.hash = ''
    })

    afterEach(() => {
        // Clean up hash after each test
        window.location.hash = ''
    })

    it('should return empty string when no hash is present', () => {
        let capturedHash = ''

        function TestComponent() {
            const [hash] = useHash()
            capturedHash = hash
            return <div>{hash || 'no-hash'}</div>
        }

        const { getByText } = render(<TestComponent />)
        expect(getByText('no-hash')).toBeInTheDocument()
        expect(capturedHash).toBe('')
    })

    it('should return current hash without # symbol', () => {
        window.location.hash = '#test-section'
        let capturedHash = ''

        function TestComponent() {
            const [hash] = useHash()
            capturedHash = hash
            return <div>{hash}</div>
        }

        const { getByText } = render(<TestComponent />)
        expect(getByText('test-section')).toBeInTheDocument()
        expect(capturedHash).toBe('test-section')
    })

    it('should update hash when setHash is called', async () => {
        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('new-section')}>
                        Set Hash
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('hash-value')).toHaveTextContent('no-hash')

        fireEvent.click(getByText('Set Hash'))

        await waitFor(() => {
            expect(window.location.hash).toBe('#new-section')
            expect(getByTestId('hash-value')).toHaveTextContent('new-section')
        })
    })

    it('should remove hash when setHash is called with empty string', async () => {
        window.location.hash = '#existing-hash'

        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('')}>Clear Hash</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('hash-value')).toHaveTextContent('existing-hash')

        fireEvent.click(getByText('Clear Hash'))

        await waitFor(() => {
            expect(window.location.hash).toBe('')
            expect(getByTestId('hash-value')).toHaveTextContent('no-hash')
        })
    })

    it('should handle hash with # prefix in setHash', async () => {
        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash}</div>
                    <button onClick={() => setHash('#with-prefix')}>
                        Set Hash With Prefix
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Set Hash With Prefix'))

        await waitFor(() => {
            expect(window.location.hash).toBe('#with-prefix')
            expect(getByTestId('hash-value')).toHaveTextContent('with-prefix')
        })
    })

    it('should respond to browser hashchange events', async () => {
        function TestComponent() {
            const [hash] = useHash()

            return <div data-testid="hash-value">{hash || 'no-hash'}</div>
        }

        const { getByTestId } = render(<TestComponent />)

        expect(getByTestId('hash-value')).toHaveTextContent('no-hash')

        // Simulate browser navigation
        window.location.hash = '#browser-navigation'
        fireEvent(window, new HashChangeEvent('hashchange'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent(
                'browser-navigation'
            )
        })
    })

    it('should update when hash changes programmatically', async () => {
        function TestComponent() {
            const [hash] = useHash()

            return <div data-testid="hash-value">{hash || 'no-hash'}</div>
        }

        const { getByTestId } = render(<TestComponent />)

        window.location.hash = '#programmatic-change'
        fireEvent(window, new HashChangeEvent('hashchange'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent(
                'programmatic-change'
            )
        })

        window.location.hash = '#another-change'
        fireEvent(window, new HashChangeEvent('hashchange'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent(
                'another-change'
            )
        })
    })

    it('should handle multiple components using the same hook', async () => {
        function Component1() {
            const [hash] = useHash()
            return <div data-testid="component1">{hash || 'no-hash'}</div>
        }

        function Component2() {
            const [hash, setHash] = useHash()
            return (
                <div>
                    <div data-testid="component2">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('shared')}>Update</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(
            <>
                <Component1 />
                <Component2 />
            </>
        )

        expect(getByTestId('component1')).toHaveTextContent('no-hash')
        expect(getByTestId('component2')).toHaveTextContent('no-hash')

        fireEvent.click(getByText('Update'))

        await waitFor(() => {
            expect(getByTestId('component1')).toHaveTextContent('shared')
            expect(getByTestId('component2')).toHaveTextContent('shared')
        })
    })

    it('should clean up event listener on unmount', async () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        function TestComponent() {
            const [hash] = useHash()
            return <div>{hash}</div>
        }

        const { unmount } = render(<TestComponent />)

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'hashchange',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'hashchange',
            expect.any(Function)
        )

        addEventListenerSpy.mockRestore()
        removeEventListenerSpy.mockRestore()
    })

    it('should handle rapid hash changes', async () => {
        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('first')}>First</button>
                    <button onClick={() => setHash('second')}>Second</button>
                    <button onClick={() => setHash('third')}>Third</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        fireEvent.click(getByText('First'))
        fireEvent.click(getByText('Second'))
        fireEvent.click(getByText('Third'))

        await waitFor(() => {
            expect(window.location.hash).toBe('#third')
            expect(getByTestId('hash-value')).toHaveTextContent('third')
        })
    })

    it('should handle special characters in hash', async () => {
        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('section-1/subsection-2')}>
                        Set Complex Hash
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Set Complex Hash'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent(
                'section-1/subsection-2'
            )
        })
    })

    it('should maintain hash state across rerenders', async () => {
        function TestComponent({ counter }: { counter: number }) {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <div data-testid="counter">{counter}</div>
                    <button onClick={() => setHash('stable')}>Set Hash</button>
                </div>
            )
        }

        const { getByTestId, getByText, rerender } = render(
            <TestComponent counter={1} />
        )

        fireEvent.click(getByText('Set Hash'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent('stable')
        })

        // Rerender with different prop
        rerender(<TestComponent counter={2} />)

        expect(getByTestId('counter')).toHaveTextContent('2')
        expect(getByTestId('hash-value')).toHaveTextContent('stable')
    })

    it('should work with useEffect for side effects', async () => {
        const scrollSpy = jest.fn()

        function TestComponent() {
            const [hash, setHash] = useHash()

            useEffect(() => {
                if (hash) {
                    scrollSpy(hash)
                }
            }, [hash])

            return (
                <div>
                    <button onClick={() => setHash('section1')}>
                        Section 1
                    </button>
                    <button onClick={() => setHash('section2')}>
                        Section 2
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Section 1'))

        await waitFor(() => {
            expect(scrollSpy).toHaveBeenCalledWith('section1')
        })

        fireEvent.click(getByText('Section 2'))

        await waitFor(() => {
            expect(scrollSpy).toHaveBeenCalledWith('section2')
        })

        expect(scrollSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle empty hash after having a value', async () => {
        window.location.hash = '#initial'

        function TestComponent() {
            const [hash, setHash] = useHash()

            return (
                <div>
                    <div data-testid="hash-value">{hash || 'no-hash'}</div>
                    <button onClick={() => setHash('')}>Clear</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('hash-value')).toHaveTextContent('initial')

        fireEvent.click(getByText('Clear'))

        await waitFor(() => {
            expect(getByTestId('hash-value')).toHaveTextContent('no-hash')
            expect(window.location.hash).toBe('')
        })
    })

    it('should handle URL encoded characters', async () => {
        window.location.hash = '#hello%20world'

        function TestComponent() {
            const [hash] = useHash()
            return <div data-testid="hash-value">{hash}</div>
        }

        const { getByTestId } = render(<TestComponent />)

        expect(getByTestId('hash-value')).toHaveTextContent('hello%20world')
    })
})
