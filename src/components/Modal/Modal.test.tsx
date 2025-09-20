import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
    it('renders in portal when open', () => {
        render(
            <Modal open title="Title">
                Content
            </Modal>
        )
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
        const { queryByTestId } = render(
            <Modal open={false} title="Title">
                Content
            </Modal>
        )
        expect(queryByTestId('modal-overlay')).toBeNull()
    })

    it('calls onClose on overlay click', () => {
        const onClose = jest.fn()
        render(
            <Modal open onClose={onClose}>
                Content
            </Modal>
        )
        fireEvent.mouseDown(screen.getByTestId('modal-overlay'))
        expect(onClose).toHaveBeenCalled()
    })

    it('closes on ESC when enabled', () => {
        const onClose = jest.fn()
        render(
            <Modal open onClose={onClose} closeOnEsc>
                Content
            </Modal>
        )
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onClose).toHaveBeenCalled()
    })

    it('traps focus between focusable elements', () => {
        render(
            <Modal open title="Trap">
                <button>First</button>
                <button>Second</button>
            </Modal>
        )
        const first = screen.getByRole('button', { name: 'First' })
        const second = screen.getByRole('button', { name: 'Second' })
        first.focus()
        fireEvent.keyDown(first, { key: 'Tab' })
        expect(second).toHaveFocus()
        fireEvent.keyDown(second, { key: 'Tab' })
        expect(first).toHaveFocus()
    })

    it('returns focus to trigger on close', () => {
        const { rerender } = render(
            <>
                <button>Trigger</button>
                <Modal open title="Return">
                    Body
                </Modal>
            </>
        )
        const trigger = screen.getByRole('button', {
            name: 'Trigger',
        }) as HTMLButtonElement
        trigger.focus()
        expect(trigger).toHaveFocus()
        rerender(
            <>
                <button>Trigger</button>
                <Modal open={false} title="Return">
                    Body
                </Modal>
            </>
        )
        expect(trigger).toHaveFocus()
    })
})
