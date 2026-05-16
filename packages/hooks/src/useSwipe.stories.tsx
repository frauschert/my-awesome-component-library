import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useSwipe, { SwipeEvent } from './useSwipe'

const meta: Meta = {
    title: 'Hooks/useSwipe',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const BasicSwipeDemo = () => {
    const [lastSwipe, setLastSwipe] = useState<string>('None')
    const [swipeCount, setSwipeCount] = useState(0)
    const boxRef = useRef<HTMLDivElement>(null)

    useSwipe(boxRef, {
        onSwipeLeft: () => {
            setLastSwipe('← Left')
            setSwipeCount((c) => c + 1)
        },
        onSwipeRight: () => {
            setLastSwipe('Right →')
            setSwipeCount((c) => c + 1)
        },
        onSwipeUp: () => {
            setLastSwipe('↑ Up')
            setSwipeCount((c) => c + 1)
        },
        onSwipeDown: () => {
            setLastSwipe('↓ Down')
            setSwipeCount((c) => c + 1)
        },
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Basic Swipe Detection</h3>
            <p>Swipe on the box below (works with touch or mouse)</p>
            <div
                ref={boxRef}
                style={{
                    width: '400px',
                    height: '300px',
                    border: '3px dashed #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    touchAction: 'none',
                }}
            >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                    {lastSwipe === 'None'
                        ? '👆'
                        : lastSwipe.includes('Left')
                        ? '👈'
                        : lastSwipe.includes('Right')
                        ? '👉'
                        : lastSwipe.includes('Up')
                        ? '☝️'
                        : '👇'}
                </div>
                <div>Swipe in any direction</div>
                <div
                    style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        opacity: 0.9,
                    }}
                >
                    (touch or click & drag)
                </div>
            </div>
            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                }}
            >
                <div>
                    <strong>Last Swipe:</strong>{' '}
                    <span
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#667eea',
                        }}
                    >
                        {lastSwipe}
                    </span>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <strong>Total Swipes:</strong> {swipeCount}
                </div>
            </div>
        </div>
    )
}

export const BasicSwipe: Story = {
    render: () => <BasicSwipeDemo />,
}

const SwipeDetailsDemo = () => {
    const [swipeInfo, setSwipeInfo] = useState<SwipeEvent | null>(null)
    const boxRef = useRef<HTMLDivElement>(null)

    useSwipe(boxRef, {
        onSwipe: (event) => {
            setSwipeInfo(event)
        },
        threshold: 30,
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Swipe Details</h3>
            <p>View detailed information about your swipes</p>
            <div
                ref={boxRef}
                style={{
                    width: '400px',
                    height: '300px',
                    border: '3px solid #3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    touchAction: 'none',
                }}
            >
                Swipe Here
            </div>
            {swipeInfo && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Swipe Information:</h4>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px',
                            marginTop: '10px',
                        }}
                    >
                        <div
                            style={{
                                padding: '15px',
                                background: '#f0f9ff',
                                borderRadius: '6px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '5px',
                                }}
                            >
                                Direction
                            </div>
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#3b82f6',
                                }}
                            >
                                {swipeInfo.direction.toUpperCase()}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '15px',
                                background: '#f0f9ff',
                                borderRadius: '6px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '5px',
                                }}
                            >
                                Distance
                            </div>
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#3b82f6',
                                }}
                            >
                                {Math.round(swipeInfo.distance)}px
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '15px',
                                background: '#f0f9ff',
                                borderRadius: '6px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '5px',
                                }}
                            >
                                Velocity
                            </div>
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#3b82f6',
                                }}
                            >
                                {swipeInfo.velocity.toFixed(2)} px/ms
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '15px',
                                background: '#f0f9ff',
                                borderRadius: '6px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '5px',
                                }}
                            >
                                Delta
                            </div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#3b82f6',
                                }}
                            >
                                x: {Math.round(swipeInfo.deltaX)}, y:{' '}
                                {Math.round(swipeInfo.deltaY)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export const SwipeDetails: Story = {
    render: () => <SwipeDetailsDemo />,
}

const ImageCarouselDemo = () => {
    const images = [
        { id: 1, color: '#ef4444', emoji: '🎨', label: 'Art' },
        { id: 2, color: '#3b82f6', emoji: '🌊', label: 'Ocean' },
        { id: 3, color: '#10b981', emoji: '🌳', label: 'Nature' },
        { id: 4, color: '#f59e0b', emoji: '🌅', label: 'Sunset' },
        { id: 5, color: '#8b5cf6', emoji: '🎭', label: 'Theater' },
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)

    useSwipe(carouselRef, {
        onSwipeLeft: () => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        },
        onSwipeRight: () => {
            setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length
            )
        },
        onSwipeStart: () => setIsDragging(true),
        onSwipeEnd: () => setIsDragging(false),
        threshold: 50,
    })

    const currentImage = images[currentIndex]

    return (
        <div style={{ padding: '20px' }}>
            <h3>Image Carousel</h3>
            <p>Swipe left or right to navigate</p>
            <div
                ref={carouselRef}
                style={{
                    width: '400px',
                    height: '300px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: currentImage.color,
                    color: 'white',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    fontSize: '80px',
                    transition: isDragging ? 'none' : 'background 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    touchAction: 'pan-y',
                }}
            >
                <div>{currentImage.emoji}</div>
                <div
                    style={{
                        fontSize: '24px',
                        marginTop: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    {currentImage.label}
                </div>
            </div>
            <div
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                }}
            >
                {images.map((img, idx) => (
                    <button
                        key={img.id}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            background:
                                idx === currentIndex
                                    ? currentImage.color
                                    : '#ccc',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform:
                                idx === currentIndex
                                    ? 'scale(1.3)'
                                    : 'scale(1)',
                        }}
                        aria-label={`Go to ${img.label}`}
                    />
                ))}
            </div>
            <div
                style={{
                    marginTop: '15px',
                    textAlign: 'center',
                    color: '#666',
                }}
            >
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}

export const ImageCarousel: Story = {
    render: () => <ImageCarouselDemo />,
}

const SwipeActionsDemo = () => {
    const [items, setItems] = useState([
        { id: 1, text: 'Swipe me left to delete', color: '#3b82f6' },
        { id: 2, text: 'Try swiping right too', color: '#10b981' },
        { id: 3, text: 'Swipe actions are cool!', color: '#f59e0b' },
        { id: 4, text: 'This one has actions', color: '#8b5cf6' },
    ])

    const SwipeItem = ({ item }: { item: (typeof items)[0] }) => {
        const [offset, setOffset] = useState(0)
        const [isDeleting, setIsDeleting] = useState(false)
        const itemRef = useRef<HTMLDivElement>(null)

        useSwipe(itemRef, {
            onSwipeMove: (event) => {
                setOffset(event.deltaX)
            },
            onSwipeLeft: () => {
                setIsDeleting(true)
                setTimeout(() => {
                    setItems((prev) => prev.filter((i) => i.id !== item.id))
                }, 300)
            },
            onSwipeRight: () => {
                alert(`Archived: ${item.text}`)
                setOffset(0)
            },
            onSwipeEnd: () => {
                if (!isDeleting && Math.abs(offset) < 100) {
                    setOffset(0)
                }
            },
            threshold: 100,
            trackMouse: true,
        })

        return (
            <div
                style={{
                    position: 'relative',
                    marginBottom: '10px',
                    height: '60px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                }}
            >
                {/* Background actions */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px',
                    }}
                >
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                        📁 Archive
                    </div>
                    <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        🗑️ Delete
                    </div>
                </div>

                {/* Swipeable item */}
                <div
                    ref={itemRef}
                    style={{
                        position: 'relative',
                        height: '100%',
                        background: item.color,
                        color: 'white',
                        padding: '0 20px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'grab',
                        userSelect: 'none',
                        transform: `translateX(${offset}px)`,
                        transition: isDeleting
                            ? 'transform 0.3s ease, opacity 0.3s ease'
                            : Math.abs(offset) < 5
                            ? 'transform 0.3s ease'
                            : 'none',
                        opacity: isDeleting ? 0 : 1,
                        touchAction: 'pan-y',
                    }}
                >
                    {item.text}
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Swipe Actions</h3>
            <p>
                Swipe left to delete, right to archive
                <br />
                <small style={{ color: '#666' }}>
                    (Drag past 100px to trigger action)
                </small>
            </p>
            <div style={{ maxWidth: '400px', marginTop: '20px' }}>
                {items.length === 0 ? (
                    <div
                        style={{
                            padding: '40px',
                            textAlign: 'center',
                            color: '#666',
                            background: '#f5f5f5',
                            borderRadius: '8px',
                        }}
                    >
                        All items cleared! Refresh to reset.
                    </div>
                ) : (
                    items.map((item) => <SwipeItem key={item.id} item={item} />)
                )}
            </div>
        </div>
    )
}

export const SwipeActions: Story = {
    render: () => <SwipeActionsDemo />,
}
