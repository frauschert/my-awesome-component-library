import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ToastProvider } from '../'
import { notify } from '../'

function setupProvider(
    props?: Partial<React.ComponentProps<typeof ToastProvider>>
) {
    return render(
        <ToastProvider position="bottom-right" dismissOnEscape {...props}>
            <div>host</div>
        </ToastProvider>
    )
}

describe('Toast UX behaviors', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    it('auto-dismisses after duration', () => {
        setupProvider()
        notify({ content: 'Auto', duration: 1000 })
        expect(screen.getByText('Auto')).toBeInTheDocument()
        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(screen.queryByText('Auto')).not.toBeInTheDocument()
    })

    it('pauses on hover and resumes on leave', () => {
        setupProvider()
        notify({ content: 'Hover', duration: 1000 })
        const toast = screen.getByText('Hover').closest('.toast') as HTMLElement
        expect(toast).toBeInTheDocument()

        // run for 500ms
        act(() => {
            jest.advanceTimersByTime(500)
        })
        // pause
        fireEvent.mouseEnter(toast)
        // time passes but paused
        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(screen.getByText('Hover')).toBeInTheDocument()
        // resume
        fireEvent.mouseLeave(toast)
        // finish remaining ~500ms
        act(() => {
            jest.advanceTimersByTime(600)
        })
        expect(screen.queryByText('Hover')).not.toBeInTheDocument()
    })

    it('click-to-dismiss removes the toast', () => {
        setupProvider()
        notify({ content: 'Click me', duration: -1 })
        const toast = screen
            .getByText('Click me')
            .closest('.toast') as HTMLElement
        fireEvent.click(toast)
        expect(screen.queryByText('Click me')).not.toBeInTheDocument()
    })

    it('Escape dismisses the most recent toast when enabled', () => {
        setupProvider({ dismissOnEscape: true })
        notify({ content: 'First', duration: -1 })
        notify({ content: 'Second', duration: -1 })
        expect(screen.getByText('First')).toBeInTheDocument()
        expect(screen.getByText('Second')).toBeInTheDocument()

        // Dismiss latest
        fireEvent.keyDown(window, { key: 'Escape' })
        expect(screen.queryByText('Second')).not.toBeInTheDocument()
        expect(screen.getByText('First')).toBeInTheDocument()

        // Dismiss next
        fireEvent.keyDown(window, { key: 'Escape' })
        expect(screen.queryByText('First')).not.toBeInTheDocument()
    })

    it('limits visible toasts with maxVisible while preserving latest', () => {
        setupProvider({ maxVisible: 2 })
        notify({ content: 'One', duration: -1 })
        notify({ content: 'Two', duration: -1 })
        notify({ content: 'Three', duration: -1 })
        // Only last two visible
        expect(screen.queryByText('One')).not.toBeInTheDocument()
        expect(screen.getByText('Two')).toBeInTheDocument()
        expect(screen.getByText('Three')).toBeInTheDocument()
    })
})
