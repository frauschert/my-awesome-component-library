import React, { PropsWithChildren, useState } from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Modal from './Modal'

export default {
    title: 'Components/Modal',
    component: Modal,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<PropsWithChildren<any>> = (args) => {
    const [open, setOpen] = useState(false)

    return open ? (
        <Modal>
            <button onClick={() => setOpen(false)}>Close</button>
        </Modal>
    ) : (
        <button onClick={() => setOpen(true)} />
    )
}

export const Default = Template.bind({})
