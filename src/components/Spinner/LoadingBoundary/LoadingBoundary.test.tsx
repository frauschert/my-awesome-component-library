import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoadingBoundary } from './LoadingBoundary'
import Ellipsis from '../Ellipsis'

describe('LoadingBoundary', () => {
    test('shows children when not loading', () => {
        render(
            <LoadingBoundary loading={false}>
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    test('shows spinner when loading', () => {
        render(
            <LoadingBoundary loading={true} label="Loading data">
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(screen.queryByText('Content')).not.toBeInTheDocument()
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByLabelText('Loading data')).toBeInTheDocument()
    })

    test('uses default spinner (SpinCoin)', () => {
        const { container } = render(
            <LoadingBoundary loading={true}>
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(container.querySelector('.spin-coin')).toBeInTheDocument()
    })

    test('uses custom spinner component', () => {
        const { container } = render(
            <LoadingBoundary loading={true} spinner={Ellipsis}>
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(container.querySelector('.ellipsis')).toBeInTheDocument()
    })

    test('passes spinner props', () => {
        render(
            <LoadingBoundary
                loading={true}
                label="Processing"
                spinnerProps={{ size: 'lg', variant: 'primary' }}
            >
                <div>Content</div>
            </LoadingBoundary>
        )

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '64px', height: '64px' })
    })

    test('uses default label', () => {
        render(
            <LoadingBoundary loading={true}>
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    })

    test('applies custom className', () => {
        const { container } = render(
            <LoadingBoundary loading={true} className="custom-loading">
                <div>Content</div>
            </LoadingBoundary>
        )

        expect(container.querySelector('.custom-loading')).toBeInTheDocument()
    })
})
