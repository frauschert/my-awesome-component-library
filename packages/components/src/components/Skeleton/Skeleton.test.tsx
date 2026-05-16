import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton, SkeletonLine, SkeletonImage } from './Skeleton'

describe('Skeleton', () => {
    describe('basic rendering', () => {
        it('should render with default props', () => {
            render(<Skeleton />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toBeInTheDocument()
            expect(skeleton).toHaveClass('skeleton', 'skeleton--text')
        })

        it('should render text variant', () => {
            render(<Skeleton variant="text" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--text')
        })

        it('should render circular variant', () => {
            render(<Skeleton variant="circular" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--circular')
        })

        it('should render rectangular variant', () => {
            render(<Skeleton variant="rectangular" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--rectangular')
        })
    })

    describe('animation', () => {
        it('should have animation class by default', () => {
            render(<Skeleton />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--animate')
        })

        it('should not have animation class when animate is false', () => {
            render(<Skeleton animate={false} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).not.toHaveClass('skeleton--animate')
        })
    })

    describe('dimensions', () => {
        it('should apply width as number (px)', () => {
            render(<Skeleton width={200} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ width: '200px' })
        })

        it('should apply width as string', () => {
            render(<Skeleton width="100%" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ width: '100%' })
        })

        it('should apply height as number (px)', () => {
            render(<Skeleton height={50} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ height: '50px' })
        })

        it('should apply height as string', () => {
            render(<Skeleton height="5rem" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ height: '5rem' })
        })

        it('should apply custom dimensions together', () => {
            render(<Skeleton width={300} height={150} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({
                width: '300px',
                height: '150px',
            })
        })
    })

    describe('border radius', () => {
        it('should apply default border radius for text variant', () => {
            render(<Skeleton variant="text" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '4px' })
        })

        it('should apply default border radius for circular variant', () => {
            render(<Skeleton variant="circular" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '50%' })
        })

        it('should apply default border radius for rectangular variant', () => {
            render(<Skeleton variant="rectangular" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '8px' })
        })

        it('should apply custom border radius as number', () => {
            render(<Skeleton borderRadius={16} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '16px' })
        })

        it('should apply custom border radius as string', () => {
            render(<Skeleton borderRadius="50%" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '50%' })
        })

        it('should override default border radius with custom value', () => {
            render(<Skeleton variant="circular" borderRadius={10} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveStyle({ borderRadius: '10px' })
        })
    })

    describe('accessibility', () => {
        it('should have role="status"', () => {
            render(<Skeleton />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toBeInTheDocument()
        })

        it('should have default aria-label', () => {
            render(<Skeleton />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveAttribute('aria-label', 'Loading...')
        })

        it('should accept custom aria-label', () => {
            render(<Skeleton aria-label="Loading user profile" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveAttribute(
                'aria-label',
                'Loading user profile'
            )
        })

        it('should have aria-busy by default', () => {
            render(<Skeleton />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveAttribute('aria-busy', 'true')
        })

        it('should allow setting aria-busy to false', () => {
            render(<Skeleton aria-busy={false} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveAttribute('aria-busy', 'false')
        })
    })

    describe('className', () => {
        it('should accept additional className', () => {
            render(<Skeleton className="custom-skeleton" />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass(
                'skeleton',
                'skeleton--text',
                'custom-skeleton'
            )
        })

        it('should preserve all classes when className is provided', () => {
            render(
                <Skeleton
                    variant="circular"
                    animate={true}
                    className="my-class"
                />
            )
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass(
                'skeleton',
                'skeleton--circular',
                'skeleton--animate',
                'my-class'
            )
        })
    })

    describe('compound components', () => {
        it('should render Skeleton.Text', () => {
            render(<Skeleton.Text width={200} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--text')
            expect(skeleton).toHaveStyle({ width: '200px' })
        })

        it('should render Skeleton.Circle', () => {
            render(<Skeleton.Circle width={50} height={50} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--circular')
            expect(skeleton).toHaveStyle({
                width: '50px',
                height: '50px',
            })
        })

        it('should render Skeleton.Rectangle', () => {
            render(<Skeleton.Rectangle width="100%" height={200} />)
            const skeleton = screen.getByRole('status')

            expect(skeleton).toHaveClass('skeleton--rectangular')
            expect(skeleton).toHaveStyle({
                width: '100%',
                height: '200px',
            })
        })
    })
})

describe('SkeletonLine (Legacy)', () => {
    it('should render with default size', () => {
        render(<SkeletonLine />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle({ width: '50%' })
    })

    it('should render short size', () => {
        render(<SkeletonLine size="short" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ width: '25%' })
    })

    it('should render medium size', () => {
        render(<SkeletonLine size="medium" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ width: '50%' })
    })

    it('should render large size', () => {
        render(<SkeletonLine size="large" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ width: '75%' })
    })

    it('should allow custom width to override size', () => {
        render(<SkeletonLine size="short" width={300} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ width: '300px' })
    })

    it('should apply custom height', () => {
        render(<SkeletonLine height={30} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ height: '30px' })
    })

    it('should support disabling animation', () => {
        render(<SkeletonLine animate={false} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).not.toHaveClass('skeleton--animate')
    })

    it('should pass className through', () => {
        render(<SkeletonLine className="legacy-line" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveClass('legacy-line')
    })
})

describe('SkeletonImage (Legacy)', () => {
    it('should render with default dimensions', () => {
        render(<SkeletonImage />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle({
            width: '300px',
            height: '300px',
        })
    })

    it('should apply custom width', () => {
        render(<SkeletonImage width={200} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ width: '200px' })
    })

    it('should apply custom height', () => {
        render(<SkeletonImage height={150} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ height: '150px' })
    })

    it('should apply custom border radius', () => {
        render(<SkeletonImage borderRadius={12} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({ borderRadius: '12px' })
    })

    it('should support string dimensions', () => {
        render(<SkeletonImage width="100%" height="auto" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({
            width: '100%',
            height: 'auto',
        })
    })

    it('should support disabling animation', () => {
        render(<SkeletonImage animate={false} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).not.toHaveClass('skeleton--animate')
    })

    it('should pass className through', () => {
        render(<SkeletonImage className="legacy-image" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveClass('legacy-image')
    })

    it('should use rectangular variant', () => {
        render(<SkeletonImage />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveClass('skeleton--rectangular')
    })
})

describe('edge cases', () => {
    it('should handle zero dimensions', () => {
        render(<Skeleton width={0} height={0} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({
            width: '0px',
            height: '0px',
        })
    })

    it('should handle very large dimensions', () => {
        render(<Skeleton width={9999} height={9999} />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({
            width: '9999px',
            height: '9999px',
        })
    })

    it('should handle mixed unit types', () => {
        render(<Skeleton width="50vw" height="10rem" borderRadius="1em" />)
        const skeleton = screen.getByRole('status')

        expect(skeleton).toHaveStyle({
            width: '50vw',
            height: '10rem',
            borderRadius: '1em',
        })
    })

    it('should render multiple skeletons independently', () => {
        render(
            <>
                <Skeleton data-testid="first" width={100} />
                <Skeleton data-testid="second" width={200} />
                <Skeleton data-testid="third" width={300} />
            </>
        )

        expect(screen.getByTestId('first')).toHaveStyle({ width: '100px' })
        expect(screen.getByTestId('second')).toHaveStyle({ width: '200px' })
        expect(screen.getByTestId('third')).toHaveStyle({ width: '300px' })
    })
})
