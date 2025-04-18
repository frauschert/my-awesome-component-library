import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import FileUpload, { FileUploadProps } from './FileUpload'

const meta: Meta<typeof FileUpload> = {
    title: 'Components/FileUpload/FileUpload',
    component: FileUpload,
}
export default meta
type Story = StoryObj<React.ComponentProps<typeof FileUpload>>

export const Default: Story = {
    args: {
        dragging: false,
        onDrop: (files) => console.log('Files dropped:', files),
        onDragOver: (event) => console.log('Drag over:', event),
    },
}

export const Dragging: Story = {
    args: { dragging: true },
}
