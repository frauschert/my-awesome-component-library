import React, { useEffect } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import useSearchParam from '../useSearchParam'

describe('useSearchParam', () => {
    beforeEach(() => {
        // Reset URL before each test
        window.history.pushState({}, '', '/')
    })

    afterEach(() => {
        // Clean up URL after each test
        window.history.pushState({}, '', '/')
    })

    it('should return null when parameter is not present', () => {
        let capturedValue: string | null = ''

        function TestComponent() {
            const [value] = useSearchParam('test')
            capturedValue = value
            return <div>{value || 'no-value'}</div>
        }

        const { getByText } = render(<TestComponent />)
        expect(getByText('no-value')).toBeInTheDocument()
        expect(capturedValue).toBeNull()
    })

    it('should return current parameter value', () => {
        window.history.pushState({}, '', '?search=hello')
        let capturedValue: string | null = ''

        function TestComponent() {
            const [value] = useSearchParam('search')
            capturedValue = value
            return <div>{value}</div>
        }

        const { getByText } = render(<TestComponent />)
        expect(getByText('hello')).toBeInTheDocument()
        expect(capturedValue).toBe('hello')
    })

    it('should update parameter when setParam is called', async () => {
        function TestComponent() {
            const [value, setValue] = useSearchParam('query')

            return (
                <div>
                    <div data-testid="value">{value || 'no-value'}</div>
                    <button onClick={() => setValue('test')}>Set Value</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('value')).toHaveTextContent('no-value')

        fireEvent.click(getByText('Set Value'))

        await waitFor(() => {
            expect(window.location.search).toBe('?query=test')
            expect(getByTestId('value')).toHaveTextContent('test')
        })
    })

    it('should remove parameter when set to null', async () => {
        window.history.pushState({}, '', '?filter=active')

        function TestComponent() {
            const [value, setValue] = useSearchParam('filter')

            return (
                <div>
                    <div data-testid="value">{value || 'no-value'}</div>
                    <button onClick={() => setValue(null)}>Clear</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('value')).toHaveTextContent('active')

        fireEvent.click(getByText('Clear'))

        await waitFor(() => {
            expect(window.location.search).toBe('')
            expect(getByTestId('value')).toHaveTextContent('no-value')
        })
    })

    it('should remove parameter when set to empty string', async () => {
        window.history.pushState({}, '', '?sort=asc')

        function TestComponent() {
            const [value, setValue] = useSearchParam('sort')

            return (
                <div>
                    <div data-testid="value">{value || 'no-value'}</div>
                    <button onClick={() => setValue('')}>Clear</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('value')).toHaveTextContent('asc')

        fireEvent.click(getByText('Clear'))

        await waitFor(() => {
            expect(window.location.search).toBe('')
            expect(getByTestId('value')).toHaveTextContent('no-value')
        })
    })

    it('should preserve other parameters when updating', async () => {
        window.history.pushState({}, '', '?page=1&sort=asc')

        function TestComponent() {
            const [page, setPage] = useSearchParam('page')

            return (
                <div>
                    <div data-testid="page">{page}</div>
                    <button onClick={() => setPage('2')}>Next Page</button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Next Page'))

        await waitFor(() => {
            expect(window.location.search).toBe('?page=2&sort=asc')
        })
    })

    it('should preserve hash when updating parameters', async () => {
        window.history.pushState({}, '', '?tab=home#section1')

        function TestComponent() {
            const [tab, setTab] = useSearchParam('tab')

            return (
                <div>
                    <button onClick={() => setTab('about')}>Change Tab</button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Change Tab'))

        await waitFor(() => {
            expect(window.location.search).toBe('?tab=about')
            expect(window.location.hash).toBe('#section1')
        })
    })

    it('should handle multiple components with different parameters', async () => {
        window.history.pushState({}, '', '?search=test&filter=all')

        function Component1() {
            const [search] = useSearchParam('search')
            return <div data-testid="search">{search}</div>
        }

        function Component2() {
            const [filter, setFilter] = useSearchParam('filter')
            return (
                <div>
                    <div data-testid="filter">{filter}</div>
                    <button onClick={() => setFilter('active')}>
                        Update Filter
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(
            <>
                <Component1 />
                <Component2 />
            </>
        )

        expect(getByTestId('search')).toHaveTextContent('test')
        expect(getByTestId('filter')).toHaveTextContent('all')

        fireEvent.click(getByText('Update Filter'))

        await waitFor(() => {
            expect(window.location.search).toBe('?search=test&filter=active')
            expect(getByTestId('search')).toHaveTextContent('test')
            expect(getByTestId('filter')).toHaveTextContent('active')
        })
    })

    it('should handle multiple components with same parameter', async () => {
        function Component1() {
            const [page] = useSearchParam('page')
            return <div data-testid="component1">{page || 'no-page'}</div>
        }

        function Component2() {
            const [page, setPage] = useSearchParam('page')
            return (
                <div>
                    <div data-testid="component2">{page || 'no-page'}</div>
                    <button onClick={() => setPage('3')}>Update</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(
            <>
                <Component1 />
                <Component2 />
            </>
        )

        expect(getByTestId('component1')).toHaveTextContent('no-page')
        expect(getByTestId('component2')).toHaveTextContent('no-page')

        fireEvent.click(getByText('Update'))

        await waitFor(() => {
            expect(getByTestId('component1')).toHaveTextContent('3')
            expect(getByTestId('component2')).toHaveTextContent('3')
        })
    })

    it('should respond to browser navigation', async () => {
        window.history.pushState({}, '', '?view=list')

        function TestComponent() {
            const [view] = useSearchParam('view')
            return <div data-testid="view">{view || 'no-view'}</div>
        }

        const { getByTestId } = render(<TestComponent />)

        expect(getByTestId('view')).toHaveTextContent('list')

        // Simulate browser back/forward
        window.history.pushState({}, '', '?view=grid')
        fireEvent(window, new PopStateEvent('popstate'))

        await waitFor(() => {
            expect(getByTestId('view')).toHaveTextContent('grid')
        })
    })

    it('should clean up event listener on unmount', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        function TestComponent() {
            const [value] = useSearchParam('test')
            return <div>{value}</div>
        }

        const { unmount } = render(<TestComponent />)

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'popstate',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'popstate',
            expect.any(Function)
        )

        addEventListenerSpy.mockRestore()
        removeEventListenerSpy.mockRestore()
    })

    it('should handle URL encoded values', async () => {
        window.history.pushState({}, '', '?name=John%20Doe')

        function TestComponent() {
            const [name] = useSearchParam('name')
            return <div data-testid="name">{name}</div>
        }

        const { getByTestId } = render(<TestComponent />)

        expect(getByTestId('name')).toHaveTextContent('John Doe')
    })

    it('should encode special characters when setting', async () => {
        function TestComponent() {
            const [text, setText] = useSearchParam('text')

            return (
                <div>
                    <button onClick={() => setText('hello world')}>
                        Set Text
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Set Text'))

        await waitFor(() => {
            expect(window.location.search).toBe('?text=hello+world')
        })
    })

    it('should handle rapid parameter changes', async () => {
        function TestComponent() {
            const [count, setCount] = useSearchParam('count')

            return (
                <div>
                    <div data-testid="count">{count || '0'}</div>
                    <button onClick={() => setCount('1')}>One</button>
                    <button onClick={() => setCount('2')}>Two</button>
                    <button onClick={() => setCount('3')}>Three</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        fireEvent.click(getByText('One'))
        fireEvent.click(getByText('Two'))
        fireEvent.click(getByText('Three'))

        await waitFor(() => {
            expect(window.location.search).toBe('?count=3')
            expect(getByTestId('count')).toHaveTextContent('3')
        })
    })

    it('should maintain parameter state across rerenders', async () => {
        function TestComponent({ counter }: { counter: number }) {
            const [param, setParam] = useSearchParam('data')

            return (
                <div>
                    <div data-testid="param">{param || 'no-param'}</div>
                    <div data-testid="counter">{counter}</div>
                    <button onClick={() => setParam('stable')}>
                        Set Param
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText, rerender } = render(
            <TestComponent counter={1} />
        )

        fireEvent.click(getByText('Set Param'))

        await waitFor(() => {
            expect(getByTestId('param')).toHaveTextContent('stable')
        })

        // Rerender with different prop
        rerender(<TestComponent counter={2} />)

        expect(getByTestId('counter')).toHaveTextContent('2')
        expect(getByTestId('param')).toHaveTextContent('stable')
    })

    it('should work with useEffect for side effects', async () => {
        const fetchSpy = jest.fn()

        function TestComponent() {
            const [query, setQuery] = useSearchParam('q')

            useEffect(() => {
                if (query) {
                    fetchSpy(query)
                }
            }, [query])

            return (
                <div>
                    <button onClick={() => setQuery('react')}>
                        Search React
                    </button>
                    <button onClick={() => setQuery('hooks')}>
                        Search Hooks
                    </button>
                </div>
            )
        }

        const { getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Search React'))

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('react')
        })

        fireEvent.click(getByText('Search Hooks'))

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('hooks')
        })

        expect(fetchSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle parameter key with special characters', async () => {
        function TestComponent() {
            const [value, setValue] = useSearchParam('user-id')

            return (
                <div>
                    <div data-testid="value">{value || 'no-value'}</div>
                    <button onClick={() => setValue('123')}>Set ID</button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        fireEvent.click(getByText('Set ID'))

        await waitFor(() => {
            expect(window.location.search).toBe('?user-id=123')
            expect(getByTestId('value')).toHaveTextContent('123')
        })
    })

    it('should handle numeric values as strings', async () => {
        window.history.pushState({}, '', '?page=42')

        function TestComponent() {
            const [page, setPage] = useSearchParam('page')
            const pageNum = page ? parseInt(page) : 0

            return (
                <div>
                    <div data-testid="page">{pageNum}</div>
                    <button onClick={() => setPage(String(pageNum + 1))}>
                        Next
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(<TestComponent />)

        expect(getByTestId('page')).toHaveTextContent('42')

        fireEvent.click(getByText('Next'))

        await waitFor(() => {
            expect(window.location.search).toBe('?page=43')
            expect(getByTestId('page')).toHaveTextContent('43')
        })
    })
})
