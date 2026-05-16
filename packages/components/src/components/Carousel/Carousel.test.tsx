import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carousel from './Carousel'

const slides = [
    <div key="1">Slide 1</div>,
    <div key="2">Slide 2</div>,
    <div key="3">Slide 3</div>,
]

describe('Carousel', () => {
    it('renders all slides', () => {
        render(<Carousel>{slides}</Carousel>)
        expect(screen.getByText('Slide 1')).toBeInTheDocument()
        expect(screen.getByText('Slide 2')).toBeInTheDocument()
        expect(screen.getByText('Slide 3')).toBeInTheDocument()
    })

    it('starts at defaultIndex', () => {
        render(<Carousel defaultIndex={1}>{slides}</Carousel>)
        const track = screen.getByText('Slide 1').closest('.carousel__track')
        expect(track).toHaveStyle('transform: translateX(-100%)')
    })

    it('navigates forward with next arrow', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(<Carousel onSlideChange={onSlideChange}>{slides}</Carousel>)

        await user.click(screen.getByLabelText('Next slide'))
        expect(onSlideChange).toHaveBeenCalledWith(1)
    })

    it('navigates back with previous arrow', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(
            <Carousel defaultIndex={2} onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        await user.click(screen.getByLabelText('Previous slide'))
        expect(onSlideChange).toHaveBeenCalledWith(1)
    })

    it('disables prev at first slide when not looping', () => {
        render(<Carousel>{slides}</Carousel>)
        expect(screen.getByLabelText('Previous slide')).toBeDisabled()
    })

    it('disables next at last slide when not looping', () => {
        render(<Carousel defaultIndex={2}>{slides}</Carousel>)
        expect(screen.getByLabelText('Next slide')).toBeDisabled()
    })

    it('loops when loop is true', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(
            <Carousel defaultIndex={2} loop onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        await user.click(screen.getByLabelText('Next slide'))
        expect(onSlideChange).toHaveBeenCalledWith(0)
    })

    it('loops backward when loop is true', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(
            <Carousel loop onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        await user.click(screen.getByLabelText('Previous slide'))
        expect(onSlideChange).toHaveBeenCalledWith(2)
    })

    it('navigates with dot indicators', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(<Carousel onSlideChange={onSlideChange}>{slides}</Carousel>)

        await user.click(screen.getByLabelText('Go to slide 3'))
        expect(onSlideChange).toHaveBeenCalledWith(2)
    })

    it('keyboard ArrowRight navigates forward', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(<Carousel onSlideChange={onSlideChange}>{slides}</Carousel>)

        const carousel = screen.getByRole('region')
        await user.click(carousel)
        await user.keyboard('{ArrowRight}')
        expect(onSlideChange).toHaveBeenCalledWith(1)
    })

    it('keyboard ArrowLeft navigates back', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        render(
            <Carousel defaultIndex={1} onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        const carousel = screen.getByRole('region')
        await user.click(carousel)
        await user.keyboard('{ArrowLeft}')
        expect(onSlideChange).toHaveBeenCalledWith(0)
    })

    it('hides arrows when showArrows is false', () => {
        render(<Carousel showArrows={false}>{slides}</Carousel>)
        expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument()
        expect(
            screen.queryByLabelText('Previous slide')
        ).not.toBeInTheDocument()
    })

    it('hides dots when showDots is false', () => {
        render(<Carousel showDots={false}>{slides}</Carousel>)
        expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    })

    it('hides controls for single slide', () => {
        render(
            <Carousel>
                <div>Only slide</div>
            </Carousel>
        )
        expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument()
        expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    })

    it('has accessible carousel role', () => {
        render(<Carousel>{slides}</Carousel>)
        const region = screen.getByRole('region')
        expect(region).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('marks non-active slides as aria-hidden', () => {
        render(<Carousel>{slides}</Carousel>)
        const slideGroups = screen.getAllByRole('group', { hidden: true })
        expect(slideGroups[0]).toHaveAttribute('aria-hidden', 'false')
        expect(slideGroups[1]).toHaveAttribute('aria-hidden', 'true')
    })

    it('auto-plays through slides', () => {
        jest.useFakeTimers()
        const onSlideChange = jest.fn()
        render(
            <Carousel autoPlay={1000} loop onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(onSlideChange).toHaveBeenCalledWith(1)

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(onSlideChange).toHaveBeenCalledWith(2)

        jest.useRealTimers()
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<Carousel ref={ref}>{slides}</Carousel>)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('works in controlled mode', async () => {
        const user = userEvent.setup()
        const onSlideChange = jest.fn()
        const { rerender } = render(
            <Carousel activeIndex={0} onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )

        await user.click(screen.getByLabelText('Next slide'))
        expect(onSlideChange).toHaveBeenCalledWith(1)

        rerender(
            <Carousel activeIndex={1} onSlideChange={onSlideChange}>
                {slides}
            </Carousel>
        )
        const track = screen.getByText('Slide 1').closest('.carousel__track')
        expect(track).toHaveStyle('transform: translateX(-100%)')
    })
})
