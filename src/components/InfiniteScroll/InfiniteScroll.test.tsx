import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import InfiniteScroll from './InfiniteScroll'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

beforeEach(() => {
    mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback
        return {
            observe: mockObserve,
            unobserve: mockUnobserve,
            disconnect: mockDisconnect,
        }
    })
    window.IntersectionObserver = mockIntersectionObserver as any
    jest.clearAllMocks()
})

const triggerIntersection = (isIntersecting: boolean) => {
    act(() => {
        intersectionCallback([
            {
                isIntersecting,
                intersectionRatio: isIntersecting ? 1 : 0,
                target: document.createElement('div'),
                boundingClientRect: {} as DOMRectReadOnly,
                intersectionRect: {} as DOMRectReadOnly,
                rootBounds: null,
                time: Date.now(),
            },
        ])
    })
}

describe('InfiniteScroll', () => {
    it('renders children correctly', () => {
        render(
            <InfiniteScroll onLoadMore={jest.fn()} hasMore={true}>
                <div data-testid="child">Child Content</div>
            </InfiniteScroll>
        )

        expect(screen.getByTestId('child')).toBeInTheDocument()
        expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('calls onLoadMore when sentinel intersects and hasMore is true', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll onLoadMore={onLoadMore} hasMore={true}>
                <div>Content</div>
            </InfiniteScroll>
        )

        triggerIntersection(true)

        await waitFor(() => {
            expect(onLoadMore).toHaveBeenCalledTimes(1)
        })
    })

    it('does not call onLoadMore when hasMore is false', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll onLoadMore={onLoadMore} hasMore={false}>
                <div>Content</div>
            </InfiniteScroll>
        )

        triggerIntersection(true)

        // Wait a bit to ensure no call is made
        await new Promise((r) => setTimeout(r, 150))
        expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('does not call onLoadMore when isLoading is true', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll
                onLoadMore={onLoadMore}
                hasMore={true}
                isLoading={true}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        triggerIntersection(true)

        await new Promise((r) => setTimeout(r, 150))
        expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('shows default loader when isLoading is true', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                isLoading={true}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('shows custom loader when provided and isLoading is true', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                isLoading={true}
                loader={
                    <div data-testid="custom-loader">Custom Loading...</div>
                }
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(screen.getByTestId('custom-loader')).toBeInTheDocument()
        expect(screen.getByText('Custom Loading...')).toBeInTheDocument()
    })

    it('shows default end message when hasMore is false', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={false}
                isLoading={false}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(screen.getByText('No more items to load')).toBeInTheDocument()
    })

    it('shows custom end message when provided and hasMore is false', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={false}
                isLoading={false}
                endMessage={<div data-testid="end-message">All done!</div>}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(screen.getByTestId('end-message')).toBeInTheDocument()
        expect(screen.getByText('All done!')).toBeInTheDocument()
    })

    it('does not show end message when still loading', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={false}
                isLoading={true}
                endMessage={<div>All done!</div>}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(screen.queryByText('All done!')).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                className="custom-class"
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(container.querySelector('.infinite-scroll')).toHaveClass(
            'custom-class'
        )
    })

    it('applies custom style', () => {
        const { container } = render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                style={{ backgroundColor: 'red' }}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(container.querySelector('.infinite-scroll')).toHaveStyle({
            backgroundColor: 'red',
        })
    })

    it('applies inverse class when inverse prop is true', () => {
        const { container } = render(
            <InfiniteScroll onLoadMore={jest.fn()} hasMore={true} inverse>
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(container.querySelector('.infinite-scroll')).toHaveClass(
            'infinite-scroll--inverse'
        )
    })

    it('applies use-window class when useWindow prop is true', () => {
        const { container } = render(
            <InfiniteScroll onLoadMore={jest.fn()} hasMore={true} useWindow>
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(container.querySelector('.infinite-scroll')).toHaveClass(
            'infinite-scroll--use-window'
        )
    })

    it('debounces rapid intersection events', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll
                onLoadMore={onLoadMore}
                hasMore={true}
                debounceMs={200}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        // Trigger multiple rapid intersections
        triggerIntersection(true)
        triggerIntersection(true)
        triggerIntersection(true)

        await waitFor(() => {
            expect(onLoadMore).toHaveBeenCalledTimes(1)
        })
    })

    it('passes correct rootMargin for down direction', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                direction="down"
                threshold="300px"
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                rootMargin: '0px 0px 300px 0px',
            })
        )
    })

    it('passes correct rootMargin for up direction', () => {
        render(
            <InfiniteScroll
                onLoadMore={jest.fn()}
                hasMore={true}
                direction="up"
                threshold="300px"
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                rootMargin: '300px 0px 0px 0px',
            })
        )
    })

    it('forwards ref to container element', () => {
        const ref = React.createRef<HTMLDivElement>()

        render(
            <InfiniteScroll ref={ref} onLoadMore={jest.fn()} hasMore={true}>
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
        expect(ref.current).toHaveClass('infinite-scroll')
    })

    it('calls onLoadMore on initial load when initialLoad is true', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll
                onLoadMore={onLoadMore}
                hasMore={true}
                initialLoad={true}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        await waitFor(() => {
            expect(onLoadMore).toHaveBeenCalledTimes(1)
        })
    })

    it('does not call onLoadMore on initial load when initialLoad is false', async () => {
        const onLoadMore = jest.fn()

        render(
            <InfiniteScroll
                onLoadMore={onLoadMore}
                hasMore={true}
                initialLoad={false}
            >
                <div>Content</div>
            </InfiniteScroll>
        )

        // Wait to ensure no initial call
        await new Promise((r) => setTimeout(r, 100))
        expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('renders sentinel element', () => {
        const { container } = render(
            <InfiniteScroll onLoadMore={jest.fn()} hasMore={true}>
                <div>Content</div>
            </InfiniteScroll>
        )

        expect(
            container.querySelector('.infinite-scroll__sentinel')
        ).toBeInTheDocument()
    })

    it('hides sentinel from accessibility tree', () => {
        const { container } = render(
            <InfiniteScroll onLoadMore={jest.fn()} hasMore={true}>
                <div>Content</div>
            </InfiniteScroll>
        )

        const sentinel = container.querySelector('.infinite-scroll__sentinel')
        expect(sentinel).toHaveAttribute('aria-hidden', 'true')
    })
})
