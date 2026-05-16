import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Grid, { GridItem } from './Grid'

const meta: Meta<typeof Grid> = {
    title: 'Layout/Grid',
    component: Grid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Grid>

const ItemBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            backgroundColor: '#408bbd',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            borderRadius: '4px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {children}
    </div>
)

export const Default: Story = {
    render: () => (
        <Grid columns={3}>
            <ItemBox>Item 1</ItemBox>
            <ItemBox>Item 2</ItemBox>
            <ItemBox>Item 3</ItemBox>
            <ItemBox>Item 4</ItemBox>
            <ItemBox>Item 5</ItemBox>
            <ItemBox>Item 6</ItemBox>
        </Grid>
    ),
}

export const TwoColumns: Story = {
    render: () => (
        <Grid columns={2} gap="lg">
            <ItemBox>Column 1</ItemBox>
            <ItemBox>Column 2</ItemBox>
            <ItemBox>Column 1</ItemBox>
            <ItemBox>Column 2</ItemBox>
        </Grid>
    ),
}

export const FourColumns: Story = {
    render: () => (
        <Grid columns={4} gap="md">
            <ItemBox>1</ItemBox>
            <ItemBox>2</ItemBox>
            <ItemBox>3</ItemBox>
            <ItemBox>4</ItemBox>
            <ItemBox>5</ItemBox>
            <ItemBox>6</ItemBox>
            <ItemBox>7</ItemBox>
            <ItemBox>8</ItemBox>
        </Grid>
    ),
}

export const ResponsiveColumns: Story = {
    render: () => (
        <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
            <ItemBox>Responsive 1</ItemBox>
            <ItemBox>Responsive 2</ItemBox>
            <ItemBox>Responsive 3</ItemBox>
            <ItemBox>Responsive 4</ItemBox>
            <ItemBox>Responsive 5</ItemBox>
            <ItemBox>Responsive 6</ItemBox>
            <ItemBox>Responsive 7</ItemBox>
            <ItemBox>Responsive 8</ItemBox>
        </Grid>
    ),
}

export const GapSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3>No Gap</h3>
                <Grid columns={3} gap="none">
                    <ItemBox>1</ItemBox>
                    <ItemBox>2</ItemBox>
                    <ItemBox>3</ItemBox>
                </Grid>
            </div>
            <div>
                <h3>Small Gap</h3>
                <Grid columns={3} gap="sm">
                    <ItemBox>1</ItemBox>
                    <ItemBox>2</ItemBox>
                    <ItemBox>3</ItemBox>
                </Grid>
            </div>
            <div>
                <h3>Large Gap</h3>
                <Grid columns={3} gap="lg">
                    <ItemBox>1</ItemBox>
                    <ItemBox>2</ItemBox>
                    <ItemBox>3</ItemBox>
                </Grid>
            </div>
        </div>
    ),
}

export const WithGridItems: Story = {
    render: () => (
        <Grid columns={6} gap="md">
            <GridItem colSpan={6}>
                <ItemBox>Full Width (6 columns)</ItemBox>
            </GridItem>
            <GridItem colSpan={3}>
                <ItemBox>Half Width (3 columns)</ItemBox>
            </GridItem>
            <GridItem colSpan={3}>
                <ItemBox>Half Width (3 columns)</ItemBox>
            </GridItem>
            <GridItem colSpan={2}>
                <ItemBox>2 columns</ItemBox>
            </GridItem>
            <GridItem colSpan={2}>
                <ItemBox>2 columns</ItemBox>
            </GridItem>
            <GridItem colSpan={2}>
                <ItemBox>2 columns</ItemBox>
            </GridItem>
        </Grid>
    ),
}

export const ResponsiveGridItems: Story = {
    render: () => (
        <Grid columns={12} gap="md">
            <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ItemBox>Responsive Item 1</ItemBox>
            </GridItem>
            <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ItemBox>Responsive Item 2</ItemBox>
            </GridItem>
            <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ItemBox>Responsive Item 3</ItemBox>
            </GridItem>
            <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ItemBox>Responsive Item 4</ItemBox>
            </GridItem>
        </Grid>
    ),
}

export const RowSpan: Story = {
    render: () => (
        <Grid columns={3} gap="md" style={{ gridAutoRows: '100px' }}>
            <GridItem rowSpan={2}>
                <ItemBox>
                    <div>Tall Item (2 rows)</div>
                </ItemBox>
            </GridItem>
            <ItemBox>1</ItemBox>
            <ItemBox>2</ItemBox>
            <ItemBox>3</ItemBox>
            <ItemBox>4</ItemBox>
        </Grid>
    ),
}

export const AutoFit: Story = {
    render: () => (
        <Grid autoFit="200px" gap="md">
            <ItemBox>Auto-fit 1</ItemBox>
            <ItemBox>Auto-fit 2</ItemBox>
            <ItemBox>Auto-fit 3</ItemBox>
            <ItemBox>Auto-fit 4</ItemBox>
            <ItemBox>Auto-fit 5</ItemBox>
            <ItemBox>Auto-fit 6</ItemBox>
        </Grid>
    ),
}

export const AutoFill: Story = {
    render: () => (
        <Grid autoFill="150px" gap="md">
            <ItemBox>Auto-fill 1</ItemBox>
            <ItemBox>Auto-fill 2</ItemBox>
            <ItemBox>Auto-fill 3</ItemBox>
            <ItemBox>Auto-fill 4</ItemBox>
        </Grid>
    ),
}

export const AlignmentCenter: Story = {
    render: () => (
        <Grid columns={3} gap="md" alignItems="center" justifyItems="center">
            <ItemBox>Centered</ItemBox>
            <ItemBox>Centered</ItemBox>
            <ItemBox>Centered</ItemBox>
        </Grid>
    ),
}

export const DashboardLayout: Story = {
    render: () => (
        <Grid columns={12} gap="md">
            <GridItem colSpan={12}>
                <div
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '1rem',
                    }}
                >
                    Header
                </div>
            </GridItem>
            <GridItem colSpan={{ xs: 12, md: 3 }}>
                <div
                    style={{
                        backgroundColor: '#f0f0f0',
                        padding: '1rem',
                        minHeight: '300px',
                    }}
                >
                    Sidebar
                </div>
            </GridItem>
            <GridItem colSpan={{ xs: 12, md: 9 }}>
                <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
                    <ItemBox>Card 1</ItemBox>
                    <ItemBox>Card 2</ItemBox>
                    <ItemBox>Card 3</ItemBox>
                    <ItemBox>Card 4</ItemBox>
                    <ItemBox>Card 5</ItemBox>
                    <ItemBox>Card 6</ItemBox>
                </Grid>
            </GridItem>
            <GridItem colSpan={12}>
                <div
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '1rem',
                    }}
                >
                    Footer
                </div>
            </GridItem>
        </Grid>
    ),
}
