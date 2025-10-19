import React from 'react'
import { render, screen } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
    it('renders without crashing', () => {
        const { container } = render(<Divider />)
        expect(container.querySelector('.divider')).toBeInTheDocument()
    })

    it('has separator role', () => {
        render(<Divider />)
        expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('renders label when provided', () => {
        render(<Divider label="Section" />)
        expect(screen.getByText('Section')).toBeInTheDocument()
    })

    it('applies horizontal orientation by default', () => {
        const { container } = render(<Divider />)
        expect(
            container.querySelector('.divider-wrapper--horizontal')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.divider--horizontal')
        ).toBeInTheDocument()
    })

    it('applies vertical orientation', () => {
        const { container } = render(<Divider orientation="vertical" />)
        expect(
            container.querySelector('.divider-wrapper--vertical')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.divider--vertical')
        ).toBeInTheDocument()
    })

    it('applies solid variant by default', () => {
        const { container } = render(<Divider />)
        expect(container.querySelector('.divider--solid')).toBeInTheDocument()
    })

    it('applies dashed variant', () => {
        const { container } = render(<Divider variant="dashed" />)
        expect(container.querySelector('.divider--dashed')).toBeInTheDocument()
    })

    it('applies dotted variant', () => {
        const { container } = render(<Divider variant="dotted" />)
        expect(container.querySelector('.divider--dotted')).toBeInTheDocument()
    })

    it('applies default color by default', () => {
        const { container } = render(<Divider />)
        expect(container.querySelector('.divider--default')).toBeInTheDocument()
    })

    it('applies primary color', () => {
        const { container } = render(<Divider color="primary" />)
        expect(container.querySelector('.divider--primary')).toBeInTheDocument()
    })

    it('applies secondary color', () => {
        const { container } = render(<Divider color="secondary" />)
        expect(
            container.querySelector('.divider--secondary')
        ).toBeInTheDocument()
    })

    it('applies medium spacing by default', () => {
        const { container } = render(<Divider />)
        expect(
            container.querySelector('.divider-wrapper--medium')
        ).toBeInTheDocument()
    })

    it('applies small spacing', () => {
        const { container } = render(<Divider spacing="small" />)
        expect(
            container.querySelector('.divider-wrapper--small')
        ).toBeInTheDocument()
    })

    it('applies large spacing', () => {
        const { container } = render(<Divider spacing="large" />)
        expect(
            container.querySelector('.divider-wrapper--large')
        ).toBeInTheDocument()
    })

    it('applies no spacing', () => {
        const { container } = render(<Divider spacing="none" />)
        expect(
            container.querySelector('.divider-wrapper--none')
        ).toBeInTheDocument()
    })

    it('applies center label alignment by default', () => {
        const { container } = render(<Divider label="Test" />)
        expect(
            container.querySelector('.divider-wrapper--label-center')
        ).toBeInTheDocument()
    })

    it('applies left label alignment', () => {
        const { container } = render(<Divider label="Test" labelAlign="left" />)
        expect(
            container.querySelector('.divider-wrapper--label-left')
        ).toBeInTheDocument()
    })

    it('applies right label alignment', () => {
        const { container } = render(
            <Divider label="Test" labelAlign="right" />
        )
        expect(
            container.querySelector('.divider-wrapper--label-right')
        ).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<Divider className="custom-divider" />)
        expect(container.querySelector('.custom-divider')).toBeInTheDocument()
    })

    it('renders three divider elements when label is present', () => {
        const { container } = render(<Divider label="Test" />)
        const dividers = container.querySelectorAll('.divider')
        expect(dividers).toHaveLength(2) // Two divider lines with label in between
    })

    it('renders one divider element when no label', () => {
        const { container } = render(<Divider />)
        const dividers = container.querySelectorAll('.divider')
        expect(dividers).toHaveLength(1)
    })

    it('does not render label for vertical dividers', () => {
        render(<Divider orientation="vertical" label="Should not show" />)
        expect(screen.queryByText('Should not show')).not.toBeInTheDocument()
    })

    it('sets aria-label when label is provided', () => {
        render(<Divider label="Section Divider" />)
        const separator = screen.getByRole('separator')
        expect(separator).toHaveAttribute('aria-label', 'Section Divider')
    })
})
