import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Rating from './Rating'

export default {
    title: 'Components/Rating',
    component: Rating,
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        precision: {
            control: 'select',
            options: ['full', 'half'],
        },
    },
} as Meta<typeof Rating>

type Story = StoryObj<typeof Rating>

export const Default: Story = {
    args: {
        value: 3,
        max: 5,
        size: 'medium',
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || 0)
        return <Rating {...args} value={value} onChange={setValue} />
    },
}

export const WithValue: Story = {
    args: {
        value: 4.5,
        max: 5,
        precision: 'half',
        showValue: true,
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || 0)
        return <Rating {...args} value={value} onChange={setValue} />
    },
}

export const ReadOnly: Story = {
    args: {
        value: 3.5,
        max: 5,
        precision: 'half',
        showValue: true,
        readOnly: true,
    },
}

export const Disabled: Story = {
    args: {
        value: 4,
        max: 5,
        disabled: true,
    },
}

export const Sizes: Story = {
    render: () => {
        const [small, setSmall] = useState(3)
        const [medium, setMedium] = useState(4)
        const [large, setLarge] = useState(5)

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Small
                    </div>
                    <Rating size="small" value={small} onChange={setSmall} />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Medium (default)
                    </div>
                    <Rating size="medium" value={medium} onChange={setMedium} />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Large
                    </div>
                    <Rating size="large" value={large} onChange={setLarge} />
                </div>
            </div>
        )
    },
}

export const HalfStars: Story = {
    render: () => {
        const [value, setValue] = useState(3.5)

        return (
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Half Star Precision</h3>
                <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                    Click on the left or right side of a star
                </p>
                <Rating
                    value={value}
                    onChange={setValue}
                    precision="half"
                    showValue
                    size="large"
                />
            </div>
        )
    },
}

export const CustomColor: Story = {
    render: () => {
        const [rating1, setRating1] = useState(4)
        const [rating2, setRating2] = useState(3)
        const [rating3, setRating3] = useState(5)

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Red Hearts
                    </div>
                    <Rating
                        value={rating1}
                        onChange={setRating1}
                        color="#dc3545"
                    />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Blue Stars
                    </div>
                    <Rating
                        value={rating2}
                        onChange={setRating2}
                        color="#007bff"
                    />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        Green Stars
                    </div>
                    <Rating
                        value={rating3}
                        onChange={setRating3}
                        color="#28a745"
                    />
                </div>
            </div>
        )
    },
}

export const DifferentMaxValues: Story = {
    render: () => {
        const [rating3, setRating3] = useState(2)
        const [rating5, setRating5] = useState(3)
        const [rating10, setRating10] = useState(7)

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        3 Stars Max
                    </div>
                    <Rating
                        value={rating3}
                        onChange={setRating3}
                        max={3}
                        showValue
                    />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        5 Stars Max (default)
                    </div>
                    <Rating
                        value={rating5}
                        onChange={setRating5}
                        max={5}
                        showValue
                    />
                </div>
                <div>
                    <div
                        style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}
                    >
                        10 Stars Max
                    </div>
                    <Rating
                        value={rating10}
                        onChange={setRating10}
                        max={10}
                        showValue
                    />
                </div>
            </div>
        )
    },
}

export const ProductReview: Story = {
    render: () => {
        const [overall, setOverall] = useState(4.5)
        const [quality, setQuality] = useState(5)
        const [value, setValue] = useState(4)
        const [design, setDesign] = useState(4.5)

        return (
            <div
                style={{
                    padding: '2rem',
                    maxWidth: '500px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                }}
            >
                <h3 style={{ marginBottom: '1.5rem' }}>Product Review</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>Overall Rating</span>
                        <Rating
                            value={overall}
                            onChange={setOverall}
                            precision="half"
                            showValue
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>Quality</span>
                        <Rating
                            value={quality}
                            onChange={setQuality}
                            showValue
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>Value for Money</span>
                        <Rating value={value} onChange={setValue} showValue />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>Design</span>
                        <Rating
                            value={design}
                            onChange={setDesign}
                            precision="half"
                            showValue
                        />
                    </div>
                </div>
                <button
                    style={{
                        marginTop: '1.5rem',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    Submit Review
                </button>
            </div>
        )
    },
}

export const ReadOnlyDisplay: Story = {
    render: () => (
        <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h3>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <Rating value={5} readOnly showValue precision="half" />
                        <span style={{ fontWeight: 600 }}>John Doe</span>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                        Excellent product! Highly recommended.
                    </p>
                </div>
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <Rating value={4} readOnly showValue precision="half" />
                        <span style={{ fontWeight: 600 }}>Jane Smith</span>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                        Very good quality, but shipping took a while.
                    </p>
                </div>
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <Rating
                            value={3.5}
                            readOnly
                            showValue
                            precision="half"
                        />
                        <span style={{ fontWeight: 600 }}>Bob Johnson</span>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                        Good, but not what I expected.
                    </p>
                </div>
            </div>
        </div>
    ),
}

export const FormIntegration: Story = {
    render: () => {
        const [rating, setRating] = useState(0)

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            alert(`Form submitted with rating: ${rating}`)
        }

        return (
            <form
                onSubmit={handleSubmit}
                style={{ padding: '2rem', maxWidth: '400px' }}
            >
                <h3 style={{ marginBottom: '1.5rem' }}>Rate Your Experience</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 500,
                        }}
                    >
                        How would you rate our service?
                    </label>
                    <Rating
                        name="service-rating"
                        value={rating}
                        onChange={setRating}
                        showValue
                        size="large"
                    />
                    {rating === 0 && (
                        <p
                            style={{
                                marginTop: '0.5rem',
                                color: '#dc3545',
                                fontSize: '0.875rem',
                            }}
                        >
                            Please select a rating
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={rating === 0}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: rating === 0 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: rating === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                    }}
                >
                    Submit Rating
                </button>
            </form>
        )
    },
}
