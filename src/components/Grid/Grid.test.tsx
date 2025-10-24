import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Grid, { GridItem } from '../Grid'

describe('Grid', () => {
    it('renders children', () => {
        render(
            <Grid>
                <div data-testid="child">Child</div>
            </Grid>
        )
        expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('applies default column count', () => {
        const { container } = render(<Grid>Content</Grid>)
        expect(container.firstChild).toHaveClass('grid--cols-12')
    })

    it('applies custom column count', () => {
        const { container } = render(<Grid columns={6}>Content</Grid>)
        expect(container.firstChild).toHaveClass('grid--cols-6')
    })

    it('applies responsive column count', () => {
        const { container } = render(
            <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>Content</Grid>
        )
        const grid = container.firstChild
        expect(grid).toHaveClass('grid--cols-xs-1')
        expect(grid).toHaveClass('grid--cols-sm-2')
        expect(grid).toHaveClass('grid--cols-md-3')
        expect(grid).toHaveClass('grid--cols-lg-4')
        expect(grid).toHaveClass('grid--cols-xl-6')
    })

    it('applies gap size', () => {
        const { container } = render(<Grid gap="lg">Content</Grid>)
        expect(container.firstChild).toHaveClass('grid--gap-lg')
    })

    it('applies justify-items', () => {
        const { container } = render(<Grid justifyItems="center">Content</Grid>)
        expect(container.firstChild).toHaveClass('grid--justify-items-center')
    })

    it('applies align-items', () => {
        const { container } = render(<Grid alignItems="end">Content</Grid>)
        expect(container.firstChild).toHaveClass('grid--align-items-end')
    })

    it('applies justify-content', () => {
        const { container } = render(
            <Grid justifyContent="space-between">Content</Grid>
        )
        expect(container.firstChild).toHaveClass(
            'grid--justify-content-space-between'
        )
    })

    it('applies align-content', () => {
        const { container } = render(
            <Grid alignContent="space-around">Content</Grid>
        )
        expect(container.firstChild).toHaveClass(
            'grid--align-content-space-around'
        )
    })

    it('applies auto-fit with custom style', () => {
        const { container } = render(<Grid autoFit="200px">Content</Grid>)
        const grid = container.firstChild as HTMLElement
        expect(grid.style.gridTemplateColumns).toBe(
            'repeat(auto-fit, minmax(200px, 1fr))'
        )
    })

    it('applies auto-fill with custom style', () => {
        const { container } = render(<Grid autoFill="150px">Content</Grid>)
        const grid = container.firstChild as HTMLElement
        expect(grid.style.gridTemplateColumns).toBe(
            'repeat(auto-fill, minmax(150px, 1fr))'
        )
    })

    it('applies custom className', () => {
        const { container } = render(<Grid className="custom">Content</Grid>)
        expect(container.firstChild).toHaveClass('grid')
        expect(container.firstChild).toHaveClass('custom')
    })

    it('renders as custom element', () => {
        const { container } = render(<Grid as="section">Content</Grid>)
        expect(container.firstChild?.nodeName).toBe('SECTION')
    })
})

describe('GridItem', () => {
    it('renders children', () => {
        render(
            <GridItem>
                <div data-testid="child">Child</div>
            </GridItem>
        )
        expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('applies column span', () => {
        const { container } = render(<GridItem colSpan={6}>Content</GridItem>)
        expect(container.firstChild).toHaveClass('grid-item--col-span-6')
    })

    it('applies responsive column span', () => {
        const { container } = render(
            <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                Content
            </GridItem>
        )
        const item = container.firstChild
        expect(item).toHaveClass('grid-item--col-span-xs-12')
        expect(item).toHaveClass('grid-item--col-span-sm-6')
        expect(item).toHaveClass('grid-item--col-span-md-4')
        expect(item).toHaveClass('grid-item--col-span-lg-3')
    })

    it('applies row span', () => {
        const { container } = render(<GridItem rowSpan={2}>Content</GridItem>)
        expect(container.firstChild).toHaveClass('grid-item--row-span-2')
    })

    it('applies column start', () => {
        const { container } = render(<GridItem colStart={3}>Content</GridItem>)
        expect(container.firstChild).toHaveClass('grid-item--col-start-3')
    })

    it('applies row start', () => {
        const { container } = render(<GridItem rowStart={2}>Content</GridItem>)
        expect(container.firstChild).toHaveClass('grid-item--row-start-2')
    })

    it('applies custom className', () => {
        const { container } = render(
            <GridItem className="custom">Content</GridItem>
        )
        expect(container.firstChild).toHaveClass('grid-item')
        expect(container.firstChild).toHaveClass('custom')
    })

    it('renders as custom element', () => {
        const { container } = render(<GridItem as="article">Content</GridItem>)
        expect(container.firstChild?.nodeName).toBe('ARTICLE')
    })
})
