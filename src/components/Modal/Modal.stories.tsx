import React, { PropsWithChildren, useState } from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Modal from './Modal'

export default {
    title: 'Components/Modal',
    component: Modal,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<PropsWithChildren> = (args) => {
    const [open, setOpen] = useState(false)

    return open ? (
        <Modal>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
            <button onClick={() => setOpen(false)}>Close</button>
        </Modal>
    ) : (
        <button onClick={() => setOpen(true)}>Open</button>
    )
}

export const Default = Template.bind({})
