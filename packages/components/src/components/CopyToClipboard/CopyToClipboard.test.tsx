import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CopyToClipboard from './CopyToClipboard'

describe('CopyToClipboard', () => {
    it('renders with default label', () => {
        render(<CopyToClipboard text="hello" />)
        expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })

    it('renders custom label', () => {
        render(<CopyToClipboard text="hello" label="Copy code" />)
        expect(
            screen.getByRole('button', { name: 'Copy code' })
        ).toBeInTheDocument()
    })

    it('copies text and shows copied state', async () => {
        const user = userEvent.setup()
        const onCopy = jest.fn()
        render(<CopyToClipboard text="hello world" onCopy={onCopy} />)

        await user.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(onCopy).toHaveBeenCalledWith('hello world', true)
        })
        expect(
            screen.getByRole('button', { name: 'Copied!' })
        ).toBeInTheDocument()
    })

    it('resets after delay', async () => {
        jest.useFakeTimers()
        const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
        })
        render(<CopyToClipboard text="hello" resetDelay={500} />)

        await user.click(screen.getByRole('button'))

        // Wait for copy to succeed
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Copied!' })
            ).toBeInTheDocument()
        })

        act(() => {
            jest.advanceTimersByTime(600)
        })

        expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
        jest.useRealTimers()
    })

    it('renders without icon when showIcon is false', () => {
        const { container } = render(
            <CopyToClipboard text="test" showIcon={false} />
        )
        expect(
            container.querySelector('.copy-to-clipboard__icon')
        ).not.toBeInTheDocument()
    })

    it('applies size and variant classes', () => {
        const { container } = render(
            <CopyToClipboard text="test" size="large" variant="primary" />
        )
        const btn = container.firstElementChild
        expect(btn).toHaveClass('copy-to-clipboard--large')
        expect(btn).toHaveClass('copy-to-clipboard--primary')
    })

    it('is disabled when disabled prop is set', () => {
        render(<CopyToClipboard text="test" disabled />)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLButtonElement>()
        render(<CopyToClipboard ref={ref} text="test" />)
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('shows custom copiedLabel', async () => {
        const user = userEvent.setup()
        render(<CopyToClipboard text="test" copiedLabel="Done!" />)

        await user.click(screen.getByRole('button'))
        await waitFor(() => {
            expect(screen.getByText('Done!')).toBeInTheDocument()
        })
    })
})
