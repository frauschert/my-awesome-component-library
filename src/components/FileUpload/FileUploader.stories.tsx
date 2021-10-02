import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import FileUploader from './FileUploader'

export default {
    title: 'Components/FileUpload/FileUploader',
    component: FileUploader,
} as Meta

// Create a master template for mapping args to render the Input component
const Template: Story = (args) => <FileUploader {...args} />

export const Default = Template.bind({})
