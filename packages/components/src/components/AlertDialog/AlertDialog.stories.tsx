import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import AlertDialog from './AlertDialog'

const meta: Meta<typeof AlertDialog> = {
    title: 'Components/AlertDialog',
    component: AlertDialog,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['info', 'warning', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md'],
        },
    },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
    args: {
        open: true,
        title: 'Confirm action',
        description: 'Are you sure you want to proceed?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        variant: 'info',
    },
}

export const Danger: Story = {
    args: {
        open: true,
        title: 'Delete item?',
        description:
            'This will permanently delete this item. This action cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
    },
}

export const Warning: Story = {
    args: {
        open: true,
        title: 'Unsaved changes',
        description:
            'You have unsaved changes. Are you sure you want to leave?',
        confirmLabel: 'Discard',
        cancelLabel: 'Stay',
        variant: 'warning',
    },
}

export const WithIcon: Story = {
    args: {
        open: true,
        title: 'Delete file?',
        description: 'This file will be moved to the trash.',
        confirmLabel: 'Delete',
        variant: 'danger',
        icon: '🗑️',
    },
}

export const Loading: Story = {
    args: {
        open: true,
        title: 'Processing…',
        description: 'Please wait while we process your request.',
        loading: true,
        variant: 'info',
    },
}
