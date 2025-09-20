import React from 'react'
import { StoryObj, Meta } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Modal from './Modal'

const meta: Meta<typeof Modal> = {
    title: 'Components/Modal',
    component: Modal,
}

export default meta

type Story = StoryObj<typeof Modal>

export const Basic: Story = {
    render: (args) => {
        const Demo: React.FC = () => {
            const [open, setOpen] = React.useState(true)
            return (
                <div>
                    <button onClick={() => setOpen(true)}>Open modal</button>
                    <Modal
                        {...args}
                        open={open}
                        onClose={() => setOpen(false)}
                        title="Example modal"
                    >
                        <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <button onClick={() => setOpen(false)}>
                                Close
                            </button>
                            <button>Confirm</button>
                        </div>
                    </Modal>
                </div>
            )
        }
        return <Demo />
    },
    args: {
        closeOnOverlayClick: true,
        closeOnEsc: true,
        trapFocus: true,
    },
}

export const Interaction: Story = {
    ...Basic,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        // Ensure modal is visible
        await expect(
            canvas.getByRole('dialog', { name: /example modal/i })
        ).toBeInTheDocument()
        // Click the footer Close specifically to avoid header aria-label ambiguity
        const footerClose = canvas
            .getAllByRole('button', { name: /close/i })
            .pop()!
        await userEvent.click(footerClose)
        // Wait for modal to be removed
        await expect(async () => {
            if (canvas.queryByRole('dialog')) throw new Error('still open')
        }).resolves.not.toThrow()
    },
}
