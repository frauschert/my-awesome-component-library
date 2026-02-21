import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import TagsInput from './TagsInput'

const meta: Meta<typeof TagsInput> = {
    title: 'Components/TagsInput',
    component: TagsInput,
    parameters: { layout: 'centered' },
    argTypes: {
        sizeVariant: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
}

export default meta
type Story = StoryObj<typeof TagsInput>

export const Default: Story = {
    args: {
        label: 'Tags',
        placeholder: 'Add a tag…',
    },
}

export const WithTags: Story = {
    args: {
        label: 'Technologies',
        defaultValue: ['React', 'TypeScript', 'SCSS'],
    },
}

export const MaxTags: Story = {
    args: {
        label: 'Max 3 tags',
        defaultValue: ['One', 'Two'],
        maxTags: 3,
        helperText: 'You can add up to 3 tags',
    },
}

export const WithValidation: Story = {
    args: {
        label: 'Emails',
        placeholder: 'Add email…',
        validate: (tag: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag),
        helperText: 'Press Enter to add a valid email',
    },
}

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        defaultValue: ['Read', 'Only'],
        disabled: true,
    },
}

export const ErrorState: Story = {
    args: {
        label: 'Categories',
        defaultValue: ['Invalid'],
        errorText: 'At least 2 tags are required',
        invalid: true,
    },
}

export const Small: Story = {
    args: {
        label: 'Small',
        defaultValue: ['Tag'],
        sizeVariant: 'sm',
    },
}

export const Large: Story = {
    args: {
        label: 'Large',
        defaultValue: ['Tag'],
        sizeVariant: 'lg',
    },
}
