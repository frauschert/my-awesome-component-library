import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Container from './Container'

const meta: Meta<typeof Container> = {
    title: 'Layout/Container',
    component: Container,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Container>

const ContentBox: React.FC = () => (
    <div
        style={{
            backgroundColor: '#408bbd',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '4px',
        }}
    >
        Container Content
    </div>
)

export const Default: Story = {
    render: () => (
        <Container>
            <ContentBox />
        </Container>
    ),
}

export const SmallSize: Story = {
    render: () => (
        <Container size="sm">
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Max width: 640px
            </p>
        </Container>
    ),
}

export const MediumSize: Story = {
    render: () => (
        <Container size="md">
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Max width: 768px
            </p>
        </Container>
    ),
}

export const LargeSize: Story = {
    render: () => (
        <Container size="lg">
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Max width: 1024px (default)
            </p>
        </Container>
    ),
}

export const ExtraLargeSize: Story = {
    render: () => (
        <Container size="xl">
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Max width: 1280px
            </p>
        </Container>
    ),
}

export const FullSize: Story = {
    render: () => (
        <Container size="full">
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Max width: 100%
            </p>
        </Container>
    ),
}

export const Fluid: Story = {
    render: () => (
        <Container fluid>
            <ContentBox />
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                No max-width constraint (fluid)
            </p>
        </Container>
    ),
}

export const NoGutter: Story = {
    render: () => (
        <div style={{ backgroundColor: '#f0f0f0' }}>
            <Container gutter={false}>
                <ContentBox />
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    No horizontal padding
                </p>
            </Container>
        </div>
    ),
}

export const NotCentered: Story = {
    render: () => (
        <Container center={false} size="sm">
            <ContentBox />
            <p style={{ marginTop: '1rem' }}>Not horizontally centered</p>
        </Container>
    ),
}

export const ComparingAllSizes: Story = {
    render: () => (
        <div style={{ backgroundColor: '#f5f5f5', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Small (640px)
                </h3>
                <Container size="sm">
                    <div
                        style={{
                            backgroundColor: '#408bbd',
                            color: 'white',
                            padding: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        Small Container
                    </div>
                </Container>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Medium (768px)
                </h3>
                <Container size="md">
                    <div
                        style={{
                            backgroundColor: '#51cf66',
                            color: 'white',
                            padding: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        Medium Container
                    </div>
                </Container>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Large (1024px)
                </h3>
                <Container size="lg">
                    <div
                        style={{
                            backgroundColor: '#ffd43b',
                            color: '#333',
                            padding: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        Large Container
                    </div>
                </Container>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Extra Large (1280px)
                </h3>
                <Container size="xl">
                    <div
                        style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        Extra Large Container
                    </div>
                </Container>
            </div>
        </div>
    ),
}

export const ArticleLayout: Story = {
    render: () => (
        <Container size="md">
            <article>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    Article Title
                </h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Published on January 1, 2024
                </p>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris.
                </p>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
                <p style={{ lineHeight: '1.6' }}>
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo.
                </p>
            </article>
        </Container>
    ),
}

export const NestedContainers: Story = {
    render: () => (
        <div
            style={{
                backgroundColor: '#f0f0f0',
                minHeight: '100vh',
                paddingTop: '2rem',
            }}
        >
            <Container size="xl">
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                    }}
                >
                    <h2>Outer Container (XL)</h2>
                    <Container size="md">
                        <div
                            style={{
                                backgroundColor: '#e7f3ff',
                                padding: '1.5rem',
                                borderRadius: '4px',
                            }}
                        >
                            <h3>Inner Container (MD)</h3>
                            <p>Nested containers for flexible layouts</p>
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    ),
}

export const WebsiteLayout: Story = {
    render: () => (
        <div>
            {/* Header */}
            <div
                style={{
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '1rem 0',
                }}
            >
                <Container>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Brand
                        </div>
                        <nav style={{ display: 'flex', gap: '1.5rem' }}>
                            <a
                                href="#"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                About
                            </a>
                            <a
                                href="#"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                Contact
                            </a>
                        </nav>
                    </div>
                </Container>
            </div>

            {/* Hero */}
            <div
                style={{
                    backgroundColor: '#408bbd',
                    color: 'white',
                    padding: '4rem 0',
                }}
            >
                <Container>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        Welcome to Our Site
                    </h1>
                    <p style={{ fontSize: '1.25rem' }}>
                        This is a hero section with a contained layout
                    </p>
                </Container>
            </div>

            {/* Content */}
            <Container style={{ padding: '3rem 0' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    <div
                        style={{
                            padding: '1.5rem',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Feature 1</h3>
                        <p>Description of feature</p>
                    </div>
                    <div
                        style={{
                            padding: '1.5rem',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Feature 2</h3>
                        <p>Description of feature</p>
                    </div>
                    <div
                        style={{
                            padding: '1.5rem',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Feature 3</h3>
                        <p>Description of feature</p>
                    </div>
                </div>
            </Container>

            {/* Footer */}
            <div
                style={{
                    backgroundColor: '#222',
                    color: 'white',
                    padding: '2rem 0',
                    marginTop: '3rem',
                }}
            >
                <Container>
                    <p style={{ textAlign: 'center' }}>
                        © 2024 Brand. All rights reserved.
                    </p>
                </Container>
            </div>
        </div>
    ),
}
