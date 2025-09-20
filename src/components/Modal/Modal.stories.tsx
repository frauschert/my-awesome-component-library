import React from 'react'
import { StoryObj, Meta } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Modal from './Modal'

const meta: Meta<typeof Modal> = {
    title: 'Components/Modal',
    component: Modal,
    argTypes: {
        size: {
            control: { type: 'inline-radio' },
            options: ['sm', 'md', 'lg', 'xl'],
        },
    },
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
                        footer={
                            <>
                                <button onClick={() => setOpen(false)}>
                                    Close
                                </button>
                                <button>Confirm</button>
                            </>
                        }
                    >
                        <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat.
                        </p>
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
        size: 'md',
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
        const footerClose = canvas.getByRole('button', { name: /^close$/i })
        await userEvent.click(footerClose)
        // Wait for modal to be removed
        await expect(async () => {
            if (canvas.queryByRole('dialog')) throw new Error('still open')
        }).resolves.not.toThrow()
    },
}

export const Themed: Story = {
    render: (args) => {
        const Demo: React.FC = () => {
            const [open, setOpen] = React.useState(true)
            return (
                <div className="theme--dark" style={{ padding: 16 }}>
                    <button onClick={() => setOpen(true)}>Open modal</button>
                    <Modal
                        {...args}
                        open={open}
                        onClose={() => setOpen(false)}
                        title="Dark themed modal"
                        footer={
                            <button onClick={() => setOpen(false)}>
                                Close
                            </button>
                        }
                    >
                        This modal uses the dark theme hook.
                    </Modal>
                </div>
            )
        }
        return <Demo />
    },
    args: { size: 'md' },
}
