import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import DropdownMenu from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
}
export default meta

// Default story
export const Default: StoryObj<typeof DropdownMenu> = {
    render: () => <DropdownMenu />,
    name: 'Default',
}

// DropdownMenu on dark background
export const OnDarkBackground: StoryObj<typeof DropdownMenu> = {
    render: () => (
        <div style={{ background: '#222', padding: 40, minHeight: 200 }}>
            <DropdownMenu />
        </div>
    ),
    name: 'On Dark Background',
}
