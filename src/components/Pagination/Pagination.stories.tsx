import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Pagination from './Pagination'

const meta: Meta<typeof Pagination> = {
    title: 'Components/Pagination',
    component: Pagination,
    args: {
        page: 1,
        totalPages: 20,
        siblingCount: 1,
        showFirstLast: true,
        size: 'medium',
        variant: 'default',
        disabled: false,
    },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(args.page)
        return <Pagination {...args} page={page} onPageChange={setPage} />
    },
}

export const FewPages: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(1)
        return (
            <Pagination
                {...args}
                page={page}
                totalPages={5}
                onPageChange={setPage}
            />
        )
    },
}

export const Outlined: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(5)
        return (
            <Pagination
                {...args}
                page={page}
                onPageChange={setPage}
                variant="outlined"
            />
        )
    },
}

export const Filled: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(5)
        return (
            <Pagination
                {...args}
                page={page}
                onPageChange={setPage}
                variant="filled"
            />
        )
    },
}

export const Small: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(3)
        return (
            <Pagination
                {...args}
                page={page}
                onPageChange={setPage}
                size="small"
            />
        )
    },
}

export const Large: Story = {
    render: (args) => {
        const [page, setPage] = React.useState(3)
        return (
            <Pagination
                {...args}
                page={page}
                onPageChange={setPage}
                size="large"
            />
        )
    },
}

export const Disabled: Story = {
    render: (args) => (
        <Pagination {...args} page={3} onPageChange={() => {}} disabled />
    ),
}
