import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Toolbar from './Toolbar'

describe('Toolbar', () => {
    it('renders children', () => {
        render(<Toolbar>Toolbar content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveTextContent('Toolbar content')
    })

    it('has role="toolbar"', () => {
        render(<Toolbar>Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })

    it('applies default aria-label "Toolbar"', () => {
        render(<Toolbar>Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveAttribute(
            'aria-label',
            'Toolbar'
        )
    })

    it('applies custom aria-label', () => {
        render(<Toolbar ariaLabel="Formatting">Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveAttribute(
            'aria-label',
            'Formatting'
        )
    })

    it('applies variant class', () => {
        render(<Toolbar variant="elevated">Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveClass('toolbar--elevated')
    })

    it('applies size class', () => {
        render(<Toolbar size="lg">Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveClass('toolbar--lg')
    })

    it('applies position class', () => {
        render(<Toolbar position="top">Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveClass('toolbar--top')
    })

    it('renders section-based layout with leftContent, centerContent, rightContent', () => {
        render(
            <Toolbar
                leftContent={<span>Left</span>}
                centerContent={<span>Center</span>}
                rightContent={<span>Right</span>}
            >
                ignored
            </Toolbar>
        )
        expect(screen.getByText('Left')).toBeInTheDocument()
        expect(screen.getByText('Center')).toBeInTheDocument()
        expect(screen.getByText('Right')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Toolbar className="my-toolbar">Content</Toolbar>)
        expect(screen.getByRole('toolbar')).toHaveClass('my-toolbar')
    })
})
