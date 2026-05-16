import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Typography from './Typography'

const meta: Meta<typeof Typography> = {
    title: 'Components/Typography',
    component: Typography,
    parameters: {
        docs: {
            description: {
                component:
                    'Typography component for consistent text styling. Provides semantic HTML elements with predefined styles for headings, body text, captions, and more.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: [
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'subtitle1',
                'subtitle2',
                'body1',
                'body2',
                'button',
                'caption',
                'overline',
            ],
            description: 'Typography variant',
        },
        align: {
            control: { type: 'select' },
            options: ['left', 'center', 'right', 'justify', 'inherit'],
            description: 'Text alignment',
        },
        color: {
            control: { type: 'select' },
            options: [
                'primary',
                'secondary',
                'success',
                'error',
                'warning',
                'info',
                'inherit',
                'muted',
            ],
            description: 'Text color',
        },
        weight: {
            control: { type: 'select' },
            options: ['light', 'regular', 'medium', 'semibold', 'bold'],
            description: 'Font weight',
        },
        noWrap: {
            control: 'boolean',
            description: 'Prevent text wrapping with ellipsis',
        },
        gutterBottom: {
            control: 'boolean',
            description: 'Add bottom margin',
        },
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Typography>

// Basic Examples
export const Default: Story = {
    args: {
        children: 'The quick brown fox jumps over the lazy dog',
        variant: 'body1',
    },
}

export const Heading1: Story = {
    args: {
        children: 'Heading 1',
        variant: 'h1',
    },
}

export const Heading2: Story = {
    args: {
        children: 'Heading 2',
        variant: 'h2',
    },
}

export const Heading3: Story = {
    args: {
        children: 'Heading 3',
        variant: 'h3',
    },
}

// All Variants Showcase
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h1">Heading 1 - Main Title</Typography>
            <Typography variant="h2">Heading 2 - Section Title</Typography>
            <Typography variant="h3">Heading 3 - Subsection</Typography>
            <Typography variant="h4">Heading 4 - Component Title</Typography>
            <Typography variant="h5">Heading 5 - Small Heading</Typography>
            <Typography variant="h6">Heading 6 - Smallest Heading</Typography>
            <Typography variant="subtitle1">
                Subtitle 1 - Larger subtitle or lead text
            </Typography>
            <Typography variant="subtitle2">
                Subtitle 2 - Smaller subtitle or supporting text
            </Typography>
            <Typography variant="body1">
                Body 1 - Default body text with comfortable reading size
            </Typography>
            <Typography variant="body2">
                Body 2 - Smaller body text for dense content
            </Typography>
            <Typography variant="button">Button Text</Typography>
            <Typography variant="caption">
                Caption - Small supplementary text
            </Typography>
            <Typography variant="overline">Overline Label</Typography>
        </div>
    ),
}

// Color Variants
export const Colors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography color="inherit">Inherit Color (default)</Typography>
            <Typography color="primary">Primary Color</Typography>
            <Typography color="secondary">Secondary Color</Typography>
            <Typography color="success">Success Color</Typography>
            <Typography color="error">Error Color</Typography>
            <Typography color="warning">Warning Color</Typography>
            <Typography color="info">Info Color</Typography>
            <Typography color="muted">Muted Color</Typography>
        </div>
    ),
}

// Alignment
export const Alignment: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography align="left">Left aligned text</Typography>
            <Typography align="center">Center aligned text</Typography>
            <Typography align="right">Right aligned text</Typography>
            <Typography align="justify">
                Justified text - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
            </Typography>
        </div>
    ),
}

// Font Weights
export const FontWeights: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h4" weight="light">
                Light Weight (300)
            </Typography>
            <Typography variant="h4" weight="regular">
                Regular Weight (400)
            </Typography>
            <Typography variant="h4" weight="medium">
                Medium Weight (500)
            </Typography>
            <Typography variant="h4" weight="semibold">
                Semibold Weight (600)
            </Typography>
            <Typography variant="h4" weight="bold">
                Bold Weight (700)
            </Typography>
        </div>
    ),
}

// No Wrap Example
export const NoWrap: Story = {
    render: () => (
        <div
            style={{
                width: '300px',
                border: '1px dashed #ccc',
                padding: '1rem',
            }}
        >
            <Typography noWrap>
                This is a very long text that will not wrap and will be
                truncated with an ellipsis when it exceeds the container width
            </Typography>
        </div>
    ),
}

// Gutter Bottom
export const GutterBottom: Story = {
    render: () => (
        <div>
            <Typography variant="h3" gutterBottom>
                Title with Margin
            </Typography>
            <Typography>
                This paragraph follows a heading with gutterBottom prop, which
                adds spacing between elements.
            </Typography>
        </div>
    ),
}

// Custom Component
export const CustomComponent: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="body1" component="div">
                Body text rendered as a div element
            </Typography>
            <Typography variant="h4" component="span">
                Heading styled as h4 but rendered as span
            </Typography>
            <Typography variant="body1" component="label">
                Label element with body1 styling
            </Typography>
        </div>
    ),
}

// Real World Example: Article
export const ArticleExample: Story = {
    render: () => (
        <article
            style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}
        >
            <Typography variant="overline" color="primary" gutterBottom>
                Technology
            </Typography>
            <Typography variant="h1" gutterBottom>
                The Future of Web Development
            </Typography>
            <Typography variant="subtitle1" color="muted" gutterBottom>
                Exploring emerging trends and technologies shaping the modern
                web
            </Typography>
            <Typography
                variant="caption"
                color="secondary"
                gutterBottom
                style={{ display: 'block', marginBottom: '2rem' }}
            >
                Published on October 24, 2025 · 5 min read
            </Typography>

            <Typography variant="h2" gutterBottom style={{ marginTop: '2rem' }}>
                Introduction
            </Typography>
            <Typography variant="body1" gutterBottom>
                Web development continues to evolve at a rapid pace. New
                frameworks, tools, and best practices emerge regularly,
                challenging developers to stay current and adapt their skills.
            </Typography>
            <Typography variant="body1" gutterBottom>
                In this article, we'll explore some of the most significant
                trends that are shaping the future of web development and how
                they impact the way we build modern applications.
            </Typography>

            <Typography variant="h3" gutterBottom style={{ marginTop: '2rem' }}>
                Key Trends
            </Typography>
            <Typography variant="body2" gutterBottom>
                Here are some of the most important developments:
            </Typography>
            <ul style={{ marginLeft: '1.5rem' }}>
                <Typography variant="body1" component="li" gutterBottom>
                    Server-side rendering and static site generation
                </Typography>
                <Typography variant="body1" component="li" gutterBottom>
                    Progressive Web Applications (PWAs)
                </Typography>
                <Typography variant="body1" component="li" gutterBottom>
                    Edge computing and serverless architectures
                </Typography>
            </ul>

            <Typography
                variant="caption"
                color="muted"
                align="center"
                style={{ display: 'block', marginTop: '3rem' }}
            >
                © 2025 Component Library. All rights reserved.
            </Typography>
        </article>
    ),
}

// Responsive Headings
export const ResponsiveExample: Story = {
    render: () => (
        <div>
            <Typography variant="h1" gutterBottom>
                Responsive Heading 1
            </Typography>
            <Typography variant="body1" gutterBottom>
                This heading scales down on smaller screens for better
                readability.
            </Typography>
            <Typography variant="caption" color="muted">
                Try resizing your browser window to see the effect
            </Typography>
        </div>
    ),
}

// Interactive Example
export const Clickable: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography
                variant="body1"
                color="primary"
                onClick={() => alert('Typography clicked!')}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
                Click me - I'm interactive!
            </Typography>
            <Typography variant="caption" color="muted">
                Typography can handle click events and be styled interactively
            </Typography>
        </div>
    ),
}

// Mixed Styling
export const MixedStyling: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h3" color="primary" align="center">
                Centered Primary Heading
            </Typography>
            <Typography variant="body1" color="success" weight="bold">
                Bold success message
            </Typography>
            <Typography variant="subtitle2" color="error" align="right">
                Right-aligned error text
            </Typography>
            <Typography
                variant="caption"
                color="warning"
                weight="semibold"
                align="center"
            >
                Centered warning caption
            </Typography>
        </div>
    ),
}

// Long Content
export const LongContent: Story = {
    render: () => (
        <div style={{ maxWidth: '600px' }}>
            <Typography variant="h2" gutterBottom>
                Lorem Ipsum
            </Typography>
            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography variant="body1" gutterBottom>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
            </Typography>
            <Typography variant="body2" color="muted">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium.
            </Typography>
        </div>
    ),
}
