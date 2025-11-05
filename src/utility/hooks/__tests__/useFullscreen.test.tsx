import React, { useRef } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import useFullscreen from '../useFullscreen'

// Mock fullscreen API
const mockRequestFullscreen = jest.fn(() => Promise.resolve())
const mockExitFullscreen = jest.fn(() => Promise.resolve())

describe('useFullscreen', () => {
    beforeEach(() => {
        // Mock fullscreen API
        Object.defineProperty(document, 'fullscreenEnabled', {
            writable: true,
            value: true,
            configurable: true,
        })

        Object.defineProperty(document, 'fullscreenElement', {
            writable: true,
            value: null,
            configurable: true,
        })

        document.exitFullscreen = mockExitFullscreen
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should report isSupported as true when API is available', () => {
        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { isSupported } = useFullscreen(ref)

            return <div data-testid="supported">{String(isSupported)}</div>
        }

        const { getByTestId } = render(<TestComponent />)
        expect(getByTestId('supported')).toHaveTextContent('true')
    })

    it('should call requestFullscreen when enter is called', async () => {
        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { enter } = useFullscreen(ref)

            React.useEffect(() => {
                if (ref.current) {
                    ref.current.requestFullscreen = mockRequestFullscreen
                }
            }, [])

            return (
                <div>
                    <div ref={ref}>Content</div>
                    <button onClick={() => enter()}>Enter</button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Enter'))

        await waitFor(() => {
            expect(mockRequestFullscreen).toHaveBeenCalled()
        })
    })

    it('should call document.exitFullscreen when exit is called', async () => {
        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { exit } = useFullscreen(ref)

            return (
                <div>
                    <div ref={ref}>Content</div>
                    <button onClick={() => exit()}>Exit</button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Exit'))

        await waitFor(() => {
            expect(mockExitFullscreen).toHaveBeenCalled()
        })
    })

    it('should toggle by calling enter when not fullscreen', async () => {
        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { toggle } = useFullscreen(ref)

            React.useEffect(() => {
                if (ref.current) {
                    ref.current.requestFullscreen = mockRequestFullscreen
                }
            }, [])

            return (
                <div>
                    <div ref={ref}>Content</div>
                    <button onClick={() => toggle()}>Toggle</button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Toggle'))

        await waitFor(() => {
            expect(mockRequestFullscreen).toHaveBeenCalled()
        })
    })

    it('should call onError when enter fails', async () => {
        const onError = jest.fn()
        const error = new Error('Fullscreen request failed')

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { enter } = useFullscreen(ref, { onError })

            React.useEffect(() => {
                if (ref.current) {
                    ref.current.requestFullscreen = () => Promise.reject(error)
                }
            }, [])

            return (
                <div>
                    <div ref={ref}>Content</div>
                    <button onClick={() => enter().catch(() => {})}>
                        Enter
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Enter'))

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(error)
        })
    })

    it('should throw error when fullscreen is not supported', async () => {
        Object.defineProperty(document, 'fullscreenEnabled', {
            writable: true,
            value: false,
            configurable: true,
        })

        const onError = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { enter } = useFullscreen(ref, { onError })

            return (
                <div>
                    <div ref={ref}>Content</div>
                    <button onClick={() => enter().catch(() => {})}>
                        Enter
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Enter'))

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Fullscreen API is not supported',
                })
            )
        })
    })

    it('should throw error when element ref is not attached', async () => {
        const onError = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            const { enter } = useFullscreen(ref, { onError })

            return (
                <div>
                    <button onClick={() => enter().catch(() => {})}>
                        Enter
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)
        fireEvent.click(getByText('Enter'))

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Element ref is not attached',
                })
            )
        })
    })

    it('should clean up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(
            document,
            'removeEventListener'
        )

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useFullscreen(ref)
            return <div ref={ref}>Content</div>
        }

        const { unmount } = render(<TestComponent />)
        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'fullscreenchange',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })
})
