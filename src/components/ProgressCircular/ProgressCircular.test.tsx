import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProgressCircular from './ProgressCircular'

describe('ProgressCircular', () => {
    it('renders with default props', () => {
        const { container } = render(<ProgressCircular />)
        expect(container.querySelector('.svg-pi')).toBeInTheDocument()
        expect(container.querySelector('.svg-pi-track')).toBeInTheDocument()
        expect(container.querySelector('.svg-pi-indicator')).toBeInTheDocument()
    })

    it('renders with specified progress and children', () => {
        const { container } = render(
            <ProgressCircular progress={75} size={150}>
                Label
            </ProgressCircular>
        )
        const label = container.querySelector('.svg-pi-label')
        expect(label).toBeInTheDocument()
        expect(label).toHaveTextContent('Label')
        expect(label).toHaveTextContent('75%')
    })

    it('hides label when size is below 100', () => {
        const { container } = render(
            <ProgressCircular progress={50} size={80}>
                Label
            </ProgressCircular>
        )
        expect(container.querySelector('.svg-pi-label')).not.toBeInTheDocument()
    })

    it('hides label when no children provided', () => {
        const { container } = render(
            <ProgressCircular progress={50} size={150} />
        )
        expect(container.querySelector('.svg-pi-label')).not.toBeInTheDocument()
    })

    it('caps displayed progress at 100%', () => {
        const { container } = render(
            <ProgressCircular progress={120} size={150}>
                Label
            </ProgressCircular>
        )
        const progress = container.querySelector('.svg-pi-label__progress')
        expect(progress).toHaveTextContent('100%')
    })

    it('applies custom size', () => {
        const { container } = render(<ProgressCircular size={200} />)
        const wrapper = container.querySelector(
            '.svg-pi-wrapper'
        ) as HTMLElement
        expect(wrapper.style.width).toBe('200px')
        expect(wrapper.style.height).toBe('200px')
    })

    it('applies custom colors', () => {
        const { container } = render(
            <ProgressCircular trackColor="#f00" indicatorColor="#0f0" />
        )
        const track = container.querySelector(
            '.svg-pi-track'
        ) as SVGCircleElement
        const indicator = container.querySelector(
            '.svg-pi-indicator'
        ) as SVGCircleElement
        expect(track.getAttribute('stroke')).toBe('#f00')
        expect(indicator.getAttribute('stroke')).toBe('#0f0')
    })

    it('renders in spinner mode without percentage', () => {
        const { container } = render(
            <ProgressCircular spinnerMode spinnerSpeed={2} size={150}>
                Loading
            </ProgressCircular>
        )
        expect(
            container.querySelector('.svg-pi-indicator--spinner')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.svg-pi-label__progress')
        ).not.toBeInTheDocument()
    })

    it('applies custom stroke widths', () => {
        const { container } = render(
            <ProgressCircular trackWidth={5} indicatorWidth={8} />
        )
        const track = container.querySelector(
            '.svg-pi-track'
        ) as SVGCircleElement
        const indicator = container.querySelector(
            '.svg-pi-indicator'
        ) as SVGCircleElement
        expect(track.getAttribute('stroke-width')).toBe('5')
        expect(indicator.getAttribute('stroke-width')).toBe('8')
    })

    it('applies indicator cap style', () => {
        const { container } = render(<ProgressCircular indicatorCap="butt" />)
        const indicator = container.querySelector(
            '.svg-pi-indicator'
        ) as SVGCircleElement
        expect(indicator.getAttribute('stroke-linecap')).toBe('butt')
    })
})
