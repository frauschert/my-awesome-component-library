import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingActionButton from './FloatingActionButton'

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" data-testid="plus-icon">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
)

describe('FloatingActionButton', () => {
    describe('Rendering', () => {
        it('should render with icon', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add item"
                />
            )

            expect(screen.getByRole('button')).toBeInTheDocument()
            expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
        })

        it('should render with icon and label (extended)', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    label="Add Item"
                    aria-label="Add item"
                />
            )

            expect(screen.getByRole('button')).toHaveTextContent('Add Item')
            expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
        })

        it('should apply aria-label', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Create new"
                />
            )

            expect(screen.getByRole('button')).toHaveAttribute(
                'aria-label',
                'Create new'
            )
        })

        it('should apply custom className', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    className="custom-class"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('custom-class')
        })
    })

    describe('Variants', () => {
        it('should apply primary variant by default', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--primary')
        })

        it('should apply secondary variant', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    variant="secondary"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--secondary')
        })

        it('should apply danger variant', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Delete"
                    variant="danger"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--danger')
        })
    })

    describe('Sizes', () => {
        it('should apply medium size by default', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--medium')
        })

        it('should apply small size', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    size="small"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--small')
        })

        it('should apply large size', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    size="large"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--large')
        })
    })

    describe('Extended FAB', () => {
        it('should apply extended class when label is provided', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    label="Add Item"
                    aria-label="Add"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--extended')
        })

        it('should not apply extended class without label', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).not.toHaveClass('fab--extended')
        })
    })

    describe('Positioning', () => {
        it('should not apply fixed positioning by default', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).not.toHaveClass('fab--fixed')
        })

        it('should apply fixed positioning when enabled', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    fixed
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--fixed')
        })

        it('should apply bottom-right position by default when fixed', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    fixed
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--bottom-right')
        })

        it('should apply custom position when fixed', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    fixed
                    position="top-left"
                />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--top-left')
        })
    })

    describe('Elevation', () => {
        it('should apply elevation by default', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).toHaveClass('fab--elevated')
        })

        it('should not apply elevation when disabled', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    elevated={false}
                />
            )

            expect(screen.getByRole('button')).not.toHaveClass('fab--elevated')
        })
    })

    describe('Interactions', () => {
        it('should call onClick when clicked', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    onClick={handleClick}
                />
            )

            await user.click(screen.getByRole('button'))
            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should not call onClick when disabled', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    onClick={handleClick}
                    disabled
                />
            )

            await user.click(screen.getByRole('button'))
            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should be keyboard accessible', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('type', 'button')
        })
    })

    describe('Disabled state', () => {
        it('should apply disabled attribute', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    disabled
                />
            )

            expect(screen.getByRole('button')).toBeDisabled()
        })

        it('should not be disabled by default', () => {
            render(
                <FloatingActionButton icon={<PlusIcon />} aria-label="Add" />
            )

            expect(screen.getByRole('button')).not.toBeDisabled()
        })
    })

    describe('Custom props', () => {
        it('should forward custom data attributes', () => {
            render(
                <FloatingActionButton
                    icon={<PlusIcon />}
                    aria-label="Add"
                    data-testid="custom-fab"
                    data-custom="value"
                />
            )

            const button = screen.getByTestId('custom-fab')
            expect(button).toHaveAttribute('data-custom', 'value')
        })

        it('should forward ref', () => {
            const ref = React.createRef<HTMLButtonElement>()

            render(
                <FloatingActionButton
                    ref={ref}
                    icon={<PlusIcon />}
                    aria-label="Add"
                />
            )

            expect(ref.current).toBeInstanceOf(HTMLButtonElement)
        })
    })
})
