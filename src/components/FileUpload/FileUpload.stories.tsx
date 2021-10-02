import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import FileUpload, { FileUploadProps } from './FileUpload'

export default {
    title: 'Components/FileUpload/FileUpload',
    component: FileUpload,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story<FileUploadProps> = (args) => <FileUpload {...args} />

export const Default = Template.bind({})
Default.args = { dragging: false }

export const Dragging = Template.bind({})
Dragging.args = { dragging: true }
