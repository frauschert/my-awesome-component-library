import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SplitPane, { Pane } from './SplitPane'

describe('SplitPane', () => {
    it('renders without crashing', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        expect(container.querySelector('.split-pane')).toBeInTheDocument()
    })

    it('renders correct number of panes', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Pane 1</Pane>
                <Pane>Pane 2</Pane>
                <Pane>Pane 3</Pane>
            </SplitPane>
        )
        const panes = container.querySelectorAll('.split-pane__pane-wrapper')
        expect(panes).toHaveLength(3)
    })

    it('renders pane content', () => {
        render(
            <SplitPane>
                <Pane>Left Content</Pane>
                <Pane>Right Content</Pane>
            </SplitPane>
        )
        expect(screen.getByText('Left Content')).toBeInTheDocument()
        expect(screen.getByText('Right Content')).toBeInTheDocument()
    })

    it('applies horizontal direction class by default', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        expect(container.querySelector('.split-pane')).toHaveClass(
            'split-pane--horizontal'
        )
    })

    it('applies vertical direction class', () => {
        const { container } = render(
            <SplitPane direction="vertical">
                <Pane>Top</Pane>
                <Pane>Bottom</Pane>
            </SplitPane>
        )
        expect(container.querySelector('.split-pane')).toHaveClass(
            'split-pane--vertical'
        )
    })

    it('applies custom className', () => {
        const { container } = render(
            <SplitPane className="custom-split">
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        expect(container.querySelector('.split-pane')).toHaveClass(
            'custom-split'
        )
    })

    it('renders gutters between panes', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Pane 1</Pane>
                <Pane>Pane 2</Pane>
                <Pane>Pane 3</Pane>
            </SplitPane>
        )
        const gutters = container.querySelectorAll('.split-pane__gutter')
        expect(gutters).toHaveLength(2) // n-1 gutters for n panes
    })

    it('does not render gutters when showGutters is false', () => {
        const { container } = render(
            <SplitPane showGutters={false}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const gutters = container.querySelectorAll('.split-pane__gutter')
        expect(gutters).toHaveLength(0)
    })

    it('applies custom splitter size', () => {
        const { container } = render(
            <SplitPane splitterSize={16}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const gutter = container.querySelector('.split-pane__gutter')
        expect(gutter).toHaveStyle({ width: '16px' })
    })

    it('applies initial sizes to panes', () => {
        const { container } = render(
            <SplitPane initialSizes={[30, 70]}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const panes = container.querySelectorAll('.split-pane__pane-wrapper')
        expect(panes[0]).toHaveStyle({ width: '30%' })
        expect(panes[1]).toHaveStyle({ width: '70%' })
    })

    it('renders collapse button when collapsible', () => {
        const { container } = render(
            <SplitPane collapsible>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const collapseBtn = container.querySelector('.split-pane__collapse-btn')
        expect(collapseBtn).toBeInTheDocument()
    })

    it('does not render collapse button when not collapsible', () => {
        const { container } = render(
            <SplitPane collapsible={false}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const collapseBtn = container.querySelector('.split-pane__collapse-btn')
        expect(collapseBtn).not.toBeInTheDocument()
    })

    it('collapses pane when collapse button is clicked', () => {
        const { container } = render(
            <SplitPane collapsible>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )

        const collapseBtn = container.querySelector('.split-pane__collapse-btn')
        const leftPane = container.querySelectorAll(
            '.split-pane__pane-wrapper'
        )[0]

        expect(leftPane).not.toHaveClass('split-pane__pane-wrapper--collapsed')

        fireEvent.click(collapseBtn!)

        expect(leftPane).toHaveClass('split-pane__pane-wrapper--collapsed')
        expect(leftPane).toHaveStyle({ width: '0%' })
    })

    it('calls onCollapse callback when pane is collapsed', () => {
        const handleCollapse = jest.fn()
        const { container } = render(
            <SplitPane collapsible onCollapse={handleCollapse}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )

        const collapseBtn = container.querySelector('.split-pane__collapse-btn')
        fireEvent.click(collapseBtn!)

        expect(handleCollapse).toHaveBeenCalledWith(0, true)
    })

    it('calls onSizeChange callback when provided', () => {
        const handleSizeChange = jest.fn()
        const { container } = render(
            <SplitPane onSizeChange={handleSizeChange}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )

        const gutter = container.querySelector('.split-pane__gutter')
        fireEvent.mouseDown(gutter!, { clientX: 100 })
        fireEvent.mouseMove(document, { clientX: 150 })

        expect(handleSizeChange).toHaveBeenCalled()
    })

    it('renders custom gutter content', () => {
        const { container } = render(
            <SplitPane
                renderGutter={() => <div className="custom-gutter">⋮</div>}
            >
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        expect(container.querySelector('.custom-gutter')).toBeInTheDocument()
    })

    it('supports nested split panes', () => {
        const { container } = render(
            <SplitPane direction="horizontal">
                <Pane>Left</Pane>
                <Pane>
                    <SplitPane direction="vertical">
                        <Pane>Top</Pane>
                        <Pane>Bottom</Pane>
                    </SplitPane>
                </Pane>
            </SplitPane>
        )
        const splitPanes = container.querySelectorAll('.split-pane')
        expect(splitPanes).toHaveLength(2)
    })

    it('applies dragging class when dragging', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )

        const gutter = container.querySelector('.split-pane__gutter')
        const splitPane = container.querySelector('.split-pane')

        fireEvent.mouseDown(gutter!, { clientX: 100 })
        expect(splitPane).toHaveClass('split-pane--dragging')

        fireEvent.mouseUp(document)
        expect(splitPane).not.toHaveClass('split-pane--dragging')
    })

    it('handles percentage-based initial sizes', () => {
        const { container } = render(
            <SplitPane initialSizes={['25%', '75%']}>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const panes = container.querySelectorAll('.split-pane__pane-wrapper')
        expect(panes[0]).toHaveStyle({ width: '25%' })
        expect(panes[1]).toHaveStyle({ width: '75%' })
    })

    it('distributes sizes equally when initialSizes not provided', () => {
        const { container } = render(
            <SplitPane>
                <Pane>Pane 1</Pane>
                <Pane>Pane 2</Pane>
                <Pane>Pane 3</Pane>
            </SplitPane>
        )
        const panes = container.querySelectorAll('.split-pane__pane-wrapper')
        panes.forEach((pane) => {
            // Should be ~33.33% each
            const width = (pane as HTMLElement).style.width
            expect(parseFloat(width)).toBeCloseTo(33.33, 1)
        })
    })

    it('has correct ARIA label on collapse button', () => {
        const { container } = render(
            <SplitPane collapsible>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const collapseBtn = container.querySelector('.split-pane__collapse-btn')
        expect(collapseBtn).toHaveAttribute('aria-label', 'Collapse pane')
    })

    it('updates ARIA label when pane is collapsed', () => {
        const { container } = render(
            <SplitPane collapsible>
                <Pane>Left</Pane>
                <Pane>Right</Pane>
            </SplitPane>
        )
        const collapseBtn = container.querySelector('.split-pane__collapse-btn')

        expect(collapseBtn).toHaveAttribute('aria-label', 'Collapse pane')

        fireEvent.click(collapseBtn!)

        expect(collapseBtn).toHaveAttribute('aria-label', 'Expand pane')
    })
})
