import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import InfiniteScroll from './InfiniteScroll'
import Card from '../Card'

const meta: Meta<typeof InfiniteScroll> = {
    title: 'Components/InfiniteScroll',
    component: InfiniteScroll,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'InfiniteScroll automatically loads more content as the user scrolls, using IntersectionObserver for efficient detection.',
            },
        },
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InfiniteScroll>

// Mock data generator
const generateItems = (start: number, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: start + i,
        title: `Item ${start + i + 1}`,
        description: `This is the description for item number ${
            start + i + 1
        }. It contains some sample text to demonstrate the infinite scroll functionality.`,
    }))
}

// Simulated API call
const fetchItems = (
    page: number,
    pageSize: number = 10
): Promise<typeof items> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateItems(page * pageSize, pageSize))
        }, 1000)
    })
}

const items = generateItems(0, 10)

/**
 * Basic infinite scroll that loads more items when scrolling down.
 */
export const Default: Story = {
    render: () => {
        const [items, setItems] = useState(generateItems(0, 10))
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)
        const [page, setPage] = useState(1)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            const newItems = await fetchItems(page)
            setItems((prev) => [...prev, ...newItems])
            setPage((p) => p + 1)
            setHasMore(page < 5) // Stop after 5 pages
            setIsLoading(false)
        }, [page, isLoading])

        return (
            <div
                style={{
                    height: 400,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            You've seen all {items.length} items!
                        </p>
                    }
                >
                    {items.map((item) => (
                        <Card key={item.id} style={{ margin: '8px' }}>
                            <Card.Header>{item.title}</Card.Header>
                            <Card.Body>{item.description}</Card.Body>
                        </Card>
                    ))}
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * Custom loader component while fetching data.
 */
export const CustomLoader: Story = {
    render: () => {
        const [items, setItems] = useState(generateItems(0, 10))
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)
        const [page, setPage] = useState(1)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            const newItems = await fetchItems(page)
            setItems((prev) => [...prev, ...newItems])
            setPage((p) => p + 1)
            setHasMore(page < 3)
            setIsLoading(false)
        }, [page, isLoading])

        const CustomLoaderComponent = (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    gap: '12px',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e0e0e0',
                        borderTopColor: '#3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <span style={{ color: '#666', fontSize: '14px' }}>
                    Fetching more awesome content...
                </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )

        return (
            <div
                style={{
                    height: 400,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    loader={CustomLoaderComponent}
                >
                    {items.map((item) => (
                        <Card key={item.id} style={{ margin: '8px' }}>
                            <Card.Header>{item.title}</Card.Header>
                            <Card.Body>{item.description}</Card.Body>
                        </Card>
                    ))}
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * Triggers loading earlier with a larger threshold.
 */
export const EarlyTrigger: Story = {
    render: () => {
        const [items, setItems] = useState(generateItems(0, 10))
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)
        const [page, setPage] = useState(1)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            const newItems = await fetchItems(page)
            setItems((prev) => [...prev, ...newItems])
            setPage((p) => p + 1)
            setHasMore(page < 5)
            setIsLoading(false)
        }, [page, isLoading])

        return (
            <div
                style={{
                    height: 400,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    threshold="500px"
                >
                    {items.map((item) => (
                        <Card key={item.id} style={{ margin: '8px' }}>
                            <Card.Header>{item.title}</Card.Header>
                            <Card.Body>{item.description}</Card.Body>
                        </Card>
                    ))}
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * Image grid with infinite scroll - common use case.
 */
export const ImageGrid: Story = {
    render: () => {
        const [images, setImages] = useState(
            Array.from({ length: 12 }, (_, i) => ({
                id: i,
                url: `https://picsum.photos/seed/${i}/200/200`,
            }))
        )
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            await new Promise((r) => setTimeout(r, 800))

            const newImages = Array.from({ length: 12 }, (_, i) => ({
                id: images.length + i,
                url: `https://picsum.photos/seed/${images.length + i}/200/200`,
            }))

            setImages((prev) => [...prev, ...newImages])
            setHasMore(images.length < 60)
            setIsLoading(false)
        }, [images.length, isLoading])

        return (
            <div
                style={{
                    height: 500,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            All {images.length} images loaded!
                        </p>
                    }
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '8px',
                            padding: '8px',
                        }}
                    >
                        {images.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={`Image ${img.id}`}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * Chat-like interface with inverse scroll (newest at bottom).
 */
export const ChatInterface: Story = {
    render: () => {
        const generateMessages = (start: number, count: number) =>
            Array.from({ length: count }, (_, i) => ({
                id: start + i,
                text: `Message ${start + i + 1}: Lorem ipsum dolor sit amet.`,
                sender: (start + i) % 2 === 0 ? 'me' : 'other',
                time: new Date(
                    Date.now() - (start + i) * 60000
                ).toLocaleTimeString(),
            }))

        const [messages, setMessages] = useState(generateMessages(0, 15))
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            await new Promise((r) => setTimeout(r, 800))

            const newMessages = generateMessages(messages.length, 10)
            setMessages((prev) => [...newMessages, ...prev])
            setHasMore(messages.length < 50)
            setIsLoading(false)
        }, [messages.length, isLoading])

        return (
            <div
                style={{
                    height: 400,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    direction="up"
                    inverse
                    endMessage={
                        <p style={{ textAlign: 'center', color: '#999' }}>
                            Beginning of conversation
                        </p>
                    }
                >
                    <div style={{ padding: '8px' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        msg.sender === 'me'
                                            ? 'flex-end'
                                            : 'flex-start',
                                    marginBottom: '8px',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        background:
                                            msg.sender === 'me'
                                                ? '#007bff'
                                                : '#e9ecef',
                                        color:
                                            msg.sender === 'me'
                                                ? 'white'
                                                : '#333',
                                    }}
                                >
                                    <div>{msg.text}</div>
                                    <div
                                        style={{
                                            fontSize: '10px',
                                            opacity: 0.7,
                                            marginTop: '4px',
                                        }}
                                    >
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * Simple list without cards - minimal styling.
 */
export const SimpleList: Story = {
    render: () => {
        const [items, setItems] = useState(
            Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)
        )
        const [isLoading, setIsLoading] = useState(false)
        const [hasMore, setHasMore] = useState(true)

        const loadMore = useCallback(async () => {
            if (isLoading) return
            setIsLoading(true)

            await new Promise((r) => setTimeout(r, 500))

            const newItems = Array.from(
                { length: 20 },
                (_, i) => `Item ${items.length + i + 1}`
            )
            setItems((prev) => [...prev, ...newItems])
            setHasMore(items.length < 100)
            setIsLoading(false)
        }, [items.length, isLoading])

        return (
            <div
                style={{
                    height: 300,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                >
                    <ul style={{ margin: 0, padding: '0 16px' }}>
                        {items.map((item, index) => (
                            <li
                                key={index}
                                style={{
                                    padding: '12px 0',
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </InfiniteScroll>
            </div>
        )
    },
}

/**
 * No more items state with custom end message.
 */
export const NoMoreItems: Story = {
    render: () => {
        const items = generateItems(0, 5)

        return (
            <div
                style={{
                    height: 400,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <InfiniteScroll
                    onLoadMore={() => {}}
                    hasMore={false}
                    isLoading={false}
                    endMessage={
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#666',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>🎉</span>
                            <p>You've reached the end!</p>
                        </div>
                    }
                >
                    {items.map((item) => (
                        <Card key={item.id} style={{ margin: '8px' }}>
                            <Card.Header>{item.title}</Card.Header>
                            <Card.Body>{item.description}</Card.Body>
                        </Card>
                    ))}
                </InfiniteScroll>
            </div>
        )
    },
}
