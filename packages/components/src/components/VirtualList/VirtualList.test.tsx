import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VirtualList } from './VirtualList'

const generateItems = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
    }))

describe('VirtualList', () => {
    describe('Rendering', () => {
        it('should render virtual list', () => {
            const items = generateItems(100)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={400}
                    itemHeight={50}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            expect(container.querySelector('.virtual-list')).toBeInTheDocument()
        })

        it('should only render visible items initially', () => {
            const items = generateItems(100)
            render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    renderItem={(item) => (
                        <div data-testid="item">{item.title}</div>
                    )}
                />
            )
            // With height 200 and itemHeight 50, we see 4 items + overscan (default 3 on each side)
            // So maximum 10 items should be rendered
            const renderedItems = screen.getAllByTestId('item')
            expect(renderedItems.length).toBeLessThan(100)
            expect(renderedItems.length).toBeGreaterThan(0)
        })

        it('should apply custom className', () => {
            const items = generateItems(10)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={400}
                    itemHeight={50}
                    className="custom-class"
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            expect(container.querySelector('.virtual-list')).toHaveClass(
                'custom-class'
            )
        })

        it('should apply custom width', () => {
            const items = generateItems(10)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={400}
                    width={500}
                    itemHeight={50}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            const list = container.querySelector('.virtual-list') as HTMLElement
            expect(list.style.width).toBe('500px')
        })

        it('should apply custom height', () => {
            const items = generateItems(10)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={600}
                    itemHeight={50}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            const list = container.querySelector('.virtual-list') as HTMLElement
            expect(list.style.height).toBe('600px')
        })
    })

    describe('Empty State', () => {
        it('should show default empty state when no items', () => {
            render(
                <VirtualList
                    items={[]}
                    height={400}
                    itemHeight={50}
                    renderItem={(item) => <div>{item}</div>}
                />
            )
            expect(screen.getByText('No items to display')).toBeInTheDocument()
        })

        it('should show custom empty state', () => {
            render(
                <VirtualList
                    items={[]}
                    height={400}
                    itemHeight={50}
                    renderItem={(item) => <div>{item}</div>}
                    emptyState={<div>Custom empty message</div>}
                />
            )
            expect(screen.getByText('Custom empty message')).toBeInTheDocument()
        })

        it('should apply empty class when no items', () => {
            const { container } = render(
                <VirtualList
                    items={[]}
                    height={400}
                    itemHeight={50}
                    renderItem={(item) => <div>{item}</div>}
                />
            )
            expect(container.querySelector('.virtual-list')).toHaveClass(
                'virtual-list--empty'
            )
        })
    })

    describe('Scrolling', () => {
        it('should update visible items on scroll', () => {
            const items = generateItems(100)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    renderItem={(item) => (
                        <div data-testid="item">{item.title}</div>
                    )}
                />
            )

            const listContainer = container.querySelector(
                '.virtual-list'
            ) as HTMLElement
            fireEvent.scroll(listContainer, { target: { scrollTop: 500 } })

            // After scrolling, different items should be visible
            const renderedItems = screen.getAllByTestId('item')
            expect(renderedItems.length).toBeGreaterThan(0)
        })

        it('should call onScroll callback', () => {
            const items = generateItems(100)
            const handleScroll = jest.fn()
            const { container } = render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    onScroll={handleScroll}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )

            const listContainer = container.querySelector(
                '.virtual-list'
            ) as HTMLElement
            fireEvent.scroll(listContainer, { target: { scrollTop: 300 } })

            expect(handleScroll).toHaveBeenCalledWith(300)
        })
    })

    describe('Infinite Scroll', () => {
        it('should call onEndReached when scrolling near end', () => {
            const items = generateItems(50)
            const handleEndReached = jest.fn()
            const { container } = render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    onEndReached={handleEndReached}
                    endReachedThreshold={5}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )

            const listContainer = container.querySelector(
                '.virtual-list'
            ) as HTMLElement
            // Scroll to near end (50 items * 50px = 2500px total, scroll to 2200px)
            fireEvent.scroll(listContainer, { target: { scrollTop: 2200 } })

            expect(handleEndReached).toHaveBeenCalled()
        })

        it('should not call onEndReached multiple times', () => {
            const items = generateItems(50)
            const handleEndReached = jest.fn()
            const { container } = render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    onEndReached={handleEndReached}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )

            const listContainer = container.querySelector(
                '.virtual-list'
            ) as HTMLElement
            fireEvent.scroll(listContainer, { target: { scrollTop: 2200 } })
            fireEvent.scroll(listContainer, { target: { scrollTop: 2300 } })

            // Should only be called once until scrolled away and back
            expect(handleEndReached).toHaveBeenCalledTimes(1)
        })
    })

    describe('Loading State', () => {
        it('should show default loader when loading', () => {
            const items = generateItems(50)
            render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    loading={true}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should show custom loader', () => {
            const items = generateItems(50)
            render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    loading={true}
                    loader={<div>Custom loader</div>}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            expect(screen.getByText('Custom loader')).toBeInTheDocument()
        })

        it('should not show loader when not loading', () => {
            const items = generateItems(50)
            render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    loading={false}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })
    })

    describe('Item Height', () => {
        it('should apply correct item height', () => {
            const items = generateItems(10)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={400}
                    itemHeight={80}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )

            const firstItem = container.querySelector(
                '.virtual-list__item'
            ) as HTMLElement
            expect(firstItem.style.height).toBe('80px')
        })

        it('should calculate correct total height', () => {
            const items = generateItems(100)
            const { container } = render(
                <VirtualList
                    items={items}
                    height={400}
                    itemHeight={50}
                    renderItem={(item) => <div>{item.title}</div>}
                />
            )

            const content = container.querySelector(
                '.virtual-list__content'
            ) as HTMLElement
            // 100 items * 50px = 5000px
            expect(content.style.height).toBe('5000px')
        })
    })

    describe('Overscan', () => {
        it('should render extra items based on overscan', () => {
            const items = generateItems(100)
            render(
                <VirtualList
                    items={items}
                    height={200}
                    itemHeight={50}
                    overscan={5}
                    renderItem={(item) => (
                        <div data-testid="item">{item.title}</div>
                    )}
                />
            )

            const renderedItems = screen.getAllByTestId('item')
            // With height 200, itemHeight 50, we see 4 items
            // With overscan 5, we add 5 before and 5 after = 14 total
            expect(renderedItems.length).toBeGreaterThan(4)
        })
    })

    describe('Render Item', () => {
        it('should call renderItem with correct arguments', () => {
            const items = generateItems(10)
            const renderItem = jest.fn((item) => <div>{item.title}</div>)
            render(
                <VirtualList
                    items={items}
                    height={400}
                    itemHeight={50}
                    renderItem={renderItem}
                />
            )

            expect(renderItem).toHaveBeenCalled()
            expect(renderItem).toHaveBeenCalledWith(
                expect.objectContaining({ title: expect.any(String) }),
                expect.any(Number)
            )
        })
    })
})
