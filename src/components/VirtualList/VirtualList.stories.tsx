import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { VirtualList } from './VirtualList'

const meta: Meta<typeof VirtualList> = {
    title: 'Components/VirtualList',
    component: VirtualList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VirtualList>

// Generate large dataset
const generateItems = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
    }))

export const Default: Story = {
    render: () => {
        const items = generateItems(1000)

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    1,000 Items (Virtualized)
                </h3>
                <VirtualList
                    items={items}
                    height={400}
                    width={600}
                    itemHeight={60}
                    renderItem={(item) => (
                        <div
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e5e7eb',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const TenThousandItems: Story = {
    render: () => {
        const items = generateItems(10000)

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    10,000 Items - Smooth Scrolling!
                </h3>
                <VirtualList
                    items={items}
                    height={500}
                    width={700}
                    itemHeight={50}
                    renderItem={(item, index) => (
                        <div
                            style={{
                                padding: '0.75rem 1rem',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    backgroundColor: '#408bbd',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}
                            >
                                {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const WithInfiniteScroll: Story = {
    render: () => {
        const [items, setItems] = useState(generateItems(50))
        const [loading, setLoading] = useState(false)

        const loadMore = () => {
            setLoading(true)
            // Simulate API call
            setTimeout(() => {
                const currentLength = items.length
                const newItems = Array.from({ length: 20 }, (_, i) => ({
                    id: currentLength + i,
                    title: `Item ${currentLength + i + 1}`,
                    description: `Loaded item ${currentLength + i + 1}`,
                }))
                setItems([...items, ...newItems])
                setLoading(false)
            }, 1000)
        }

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    Infinite Scroll ({items.length} items loaded)
                </h3>
                <VirtualList
                    items={items}
                    height={400}
                    width={600}
                    itemHeight={60}
                    onEndReached={loadMore}
                    endReachedThreshold={5}
                    loading={loading}
                    renderItem={(item) => (
                        <div
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e5e7eb',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const ScrollToIndex: Story = {
    render: () => {
        const items = generateItems(1000)
        const [scrollToIndex, setScrollToIndex] = useState<number | undefined>()

        const handleJump = () => {
            const randomIndex = Math.floor(Math.random() * items.length)
            setScrollToIndex(randomIndex)
        }

        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={handleJump}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#408bbd',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Jump to Random Item
                    </button>
                    {scrollToIndex !== undefined && (
                        <span style={{ marginLeft: '1rem', color: '#6b7280' }}>
                            Scrolled to: Item {scrollToIndex + 1}
                        </span>
                    )}
                </div>
                <VirtualList
                    items={items}
                    height={400}
                    width={600}
                    itemHeight={60}
                    scrollToIndex={scrollToIndex}
                    renderItem={(item) => (
                        <div
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e5e7eb',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const EmptyState: Story = {
    render: () => {
        return (
            <div style={{ padding: '2rem' }}>
                <VirtualList
                    items={[]}
                    height={300}
                    width={500}
                    itemHeight={60}
                    renderItem={(item) => <div>{item}</div>}
                    emptyState={
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    fontSize: '3rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                📭
                            </div>
                            <div
                                style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}
                            >
                                No items found
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                Try adding some items to see them here
                            </div>
                        </div>
                    }
                />
            </div>
        )
    },
}

export const DifferentItemHeights: Story = {
    render: () => {
        const items = generateItems(500)

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    Cards with Consistent Height
                </h3>
                <VirtualList
                    items={items}
                    height={500}
                    width={700}
                    itemHeight={120}
                    renderItem={(item, index) => (
                        <div
                            style={{
                                margin: '0.5rem',
                                padding: '1rem',
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '8px',
                                        backgroundColor:
                                            index % 2 === 0
                                                ? '#408bbd'
                                                : '#10b981',
                                        flexShrink: 0,
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            marginBottom: '0.25rem',
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#6b7280',
                                        }}
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const CompactList: Story = {
    render: () => {
        const items = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`)

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>5,000 Compact Items</h3>
                <VirtualList
                    items={items}
                    height={400}
                    width={400}
                    itemHeight={32}
                    renderItem={(item, index) => (
                        <div
                            style={{
                                padding: '0.5rem 1rem',
                                borderBottom: '1px solid #e5e7eb',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>{item}</span>
                            <span
                                style={{
                                    color: '#6b7280',
                                    fontSize: '0.75rem',
                                }}
                            >
                                #{index + 1}
                            </span>
                        </div>
                    )}
                />
            </div>
        )
    },
}

export const WithCustomLoader: Story = {
    render: () => {
        const [items, setItems] = useState(generateItems(30))
        const [loading, setLoading] = useState(false)

        const loadMore = () => {
            setLoading(true)
            setTimeout(() => {
                const currentLength = items.length
                const newItems = Array.from({ length: 15 }, (_, i) => ({
                    id: currentLength + i,
                    title: `Item ${currentLength + i + 1}`,
                    description: `Description ${currentLength + i + 1}`,
                }))
                setItems([...items, ...newItems])
                setLoading(false)
            }, 1500)
        }

        return (
            <div style={{ padding: '2rem' }}>
                <VirtualList
                    items={items}
                    height={400}
                    width={600}
                    itemHeight={60}
                    onEndReached={loadMore}
                    loading={loading}
                    loader={
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    border: '2px solid #408bbd',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                }}
                            />
                            <span style={{ color: '#408bbd', fontWeight: 500 }}>
                                Loading more items...
                            </span>
                        </div>
                    }
                    renderItem={(item) => (
                        <div
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e5e7eb',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    )}
                />
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    },
}
