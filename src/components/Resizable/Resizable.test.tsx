import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Resizable } from './Resizable'

describe('Resizable', () => {
    describe('rendering', () => {
        it('should render children', () => {
            render(
                <Resizable>
                    <div>Test Content</div>
                </Resizable>
            )

            expect(screen.getByText('Test Content')).toBeInTheDocument()
        })

        it('should render all 8 handles by default', () => {
            const { container } = render(
                <Resizable>
                    <div>Content</div>
                </Resizable>
            )

            const handles = container.querySelectorAll('.resizable__handle')
            expect(handles).toHaveLength(8)
        })

        it('should render only specified handles', () => {
            const { container } = render(
                <Resizable handles={['right', 'bottom']}>
                    <div>Content</div>
                </Resizable>
            )

            const handles = container.querySelectorAll('.resizable__handle')
            expect(handles).toHaveLength(2)
            expect(
                container.querySelector('.resizable__handle--right')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.resizable__handle--bottom')
            ).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            const { container } = render(
                <Resizable className="custom-class">
                    <div>Content</div>
                </Resizable>
            )

            expect(container.querySelector('.resizable')).toHaveClass(
                'custom-class'
            )
        })

        it('should apply custom styles', () => {
            const { container } = render(
                <Resizable style={{ border: '1px solid red' }}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable')
            expect(wrapper).toHaveStyle({ border: '1px solid red' })
        })

        it('should apply initial width and height', () => {
            const { container } = render(
                <Resizable width={200} height={300}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable')
            expect(wrapper).toHaveStyle({ width: '200px', height: '300px' })
        })

        it('should not render handles when disabled', () => {
            const { container } = render(
                <Resizable disabled>
                    <div>Content</div>
                </Resizable>
            )

            const handles = container.querySelectorAll('.resizable__handle')
            expect(handles).toHaveLength(0)
        })

        it('should add disabled class when disabled', () => {
            const { container } = render(
                <Resizable disabled>
                    <div>Content</div>
                </Resizable>
            )

            expect(container.querySelector('.resizable')).toHaveClass(
                'resizable--disabled'
            )
        })

        it('should add hover-handles class when showHandlesOnHover is true', () => {
            const { container } = render(
                <Resizable showHandlesOnHover>
                    <div>Content</div>
                </Resizable>
            )

            expect(container.querySelector('.resizable')).toHaveClass(
                'resizable--hover-handles'
            )
        })
    })

    describe('accessibility', () => {
        it('should add role="separator" to handles', () => {
            const { container } = render(
                <Resizable handles={['right']}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--right')
            expect(handle).toHaveAttribute('role', 'separator')
        })

        it('should add aria-label to handles', () => {
            const { container } = render(
                <Resizable handles={['bottom']}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--bottom')
            expect(handle).toHaveAttribute('aria-label', 'Resize bottom')
        })

        it('should add aria-orientation to horizontal handles', () => {
            const { container } = render(
                <Resizable handles={['top', 'bottom']}>
                    <div>Content</div>
                </Resizable>
            )

            const topHandle = container.querySelector('.resizable__handle--top')
            const bottomHandle = container.querySelector(
                '.resizable__handle--bottom'
            )
            expect(topHandle).toHaveAttribute('aria-orientation', 'horizontal')
            expect(bottomHandle).toHaveAttribute(
                'aria-orientation',
                'horizontal'
            )
        })

        it('should add aria-orientation to vertical handles', () => {
            const { container } = render(
                <Resizable handles={['left', 'right']}>
                    <div>Content</div>
                </Resizable>
            )

            const leftHandle = container.querySelector(
                '.resizable__handle--left'
            )
            const rightHandle = container.querySelector(
                '.resizable__handle--right'
            )
            expect(leftHandle).toHaveAttribute('aria-orientation', 'vertical')
            expect(rightHandle).toHaveAttribute('aria-orientation', 'vertical')
        })

        it('should make handles focusable', () => {
            const { container } = render(
                <Resizable handles={['right']}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--right')
            expect(handle).toHaveAttribute('tabIndex', '0')
        })
    })

    describe('resize interaction', () => {
        beforeEach(() => {
            // Mock getBoundingClientRect
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 200,
                height: 150,
                top: 0,
                left: 0,
                bottom: 150,
                right: 200,
                x: 0,
                y: 0,
                toJSON: () => {},
            }))

            // Mock getComputedStyle
            window.getComputedStyle = jest.fn(() => ({
                width: '200px',
                height: '150px',
            })) as any
        })

        it('should call onResizeStart when dragging begins', () => {
            const onResizeStart = jest.fn()
            const { container } = render(
                <Resizable handles={['right']} onResizeStart={onResizeStart}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--right')!
            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })

            expect(onResizeStart).toHaveBeenCalledWith({
                width: 200,
                height: 150,
            })
        })

        it('should call onResize during drag', () => {
            const onResize = jest.fn()
            const { container } = render(
                <Resizable handles={['right']} onResize={onResize}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--right')!
            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 250, clientY: 100 })

            expect(onResize).toHaveBeenCalled()
        })

        it('should call onResizeEnd when dragging ends', () => {
            const onResizeEnd = jest.fn()
            const { container } = render(
                <Resizable handles={['right']} onResizeEnd={onResizeEnd}>
                    <div>Content</div>
                </Resizable>
            )

            const handle = container.querySelector('.resizable__handle--right')!
            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 250, clientY: 100 })
            fireEvent.pointerUp(document)

            expect(onResizeEnd).toHaveBeenCalled()
        })

        it('should add resizing class during drag', () => {
            const { container } = render(
                <Resizable handles={['bottom']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable')!
            const handle = container.querySelector(
                '.resizable__handle--bottom'
            )!

            expect(wrapper).not.toHaveClass('resizable--resizing')

            fireEvent.pointerDown(handle, { clientX: 100, clientY: 150 })
            expect(wrapper).toHaveClass('resizable--resizing')

            fireEvent.pointerUp(document)
            expect(wrapper).not.toHaveClass('resizable--resizing')
        })

        it('should prevent event propagation on handle pointer down', () => {
            const onClick = jest.fn()
            const { container } = render(
                <div onClick={onClick}>
                    <Resizable handles={['right']}>
                        <div>Content</div>
                    </Resizable>
                </div>
            )

            const handle = container.querySelector('.resizable__handle--right')!
            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })

            // Should not trigger parent click
            expect(onClick).not.toHaveBeenCalled()
        })
    })

    describe('resize directions', () => {
        beforeEach(() => {
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 200,
                height: 150,
                top: 0,
                left: 0,
                bottom: 150,
                right: 200,
                x: 0,
                y: 0,
                toJSON: () => {},
            }))

            window.getComputedStyle = jest.fn(() => ({
                width: '200px',
                height: '150px',
            })) as any
        })

        it('should resize right', () => {
            const { container } = render(
                <Resizable handles={['right']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--right')!

            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 250, clientY: 100 })

            expect(wrapper.style.width).toBe('250px')
        })

        it('should resize bottom', () => {
            const { container } = render(
                <Resizable handles={['bottom']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector(
                '.resizable__handle--bottom'
            )!

            fireEvent.pointerDown(handle, { clientX: 100, clientY: 150 })
            fireEvent.pointerMove(document, { clientX: 100, clientY: 200 })

            expect(wrapper.style.height).toBe('200px')
        })

        it('should resize left', () => {
            const { container } = render(
                <Resizable handles={['left']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--left')!

            fireEvent.pointerDown(handle, { clientX: 0, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: -50, clientY: 100 })

            expect(wrapper.style.width).toBe('250px')
        })

        it('should resize top', () => {
            const { container } = render(
                <Resizable handles={['top']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--top')!

            fireEvent.pointerDown(handle, { clientX: 100, clientY: 0 })
            fireEvent.pointerMove(document, { clientX: 100, clientY: -50 })

            expect(wrapper.style.height).toBe('200px')
        })

        it('should resize bottomRight corner', () => {
            const { container } = render(
                <Resizable handles={['bottomRight']}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector(
                '.resizable__handle--bottomRight'
            )!

            fireEvent.pointerDown(handle, { clientX: 200, clientY: 150 })
            fireEvent.pointerMove(document, { clientX: 250, clientY: 200 })

            expect(wrapper.style.width).toBe('250px')
            expect(wrapper.style.height).toBe('200px')
        })
    })

    describe('constraints', () => {
        beforeEach(() => {
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                width: 200,
                height: 150,
                top: 0,
                left: 0,
                bottom: 150,
                right: 200,
                x: 0,
                y: 0,
                toJSON: () => {},
            }))

            window.getComputedStyle = jest.fn(() => ({
                width: '200px',
                height: '150px',
            })) as any
        })

        it('should respect minWidth', () => {
            const { container } = render(
                <Resizable handles={['right']} minWidth={100}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--right')!

            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 50, clientY: 100 })

            expect(wrapper.style.width).toBe('100px')
        })

        it('should respect minHeight', () => {
            const { container } = render(
                <Resizable handles={['bottom']} minHeight={80}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector(
                '.resizable__handle--bottom'
            )!

            fireEvent.pointerDown(handle, { clientX: 100, clientY: 150 })
            fireEvent.pointerMove(document, { clientX: 100, clientY: 50 })

            expect(wrapper.style.height).toBe('80px')
        })

        it('should respect maxWidth', () => {
            const { container } = render(
                <Resizable handles={['right']} maxWidth={300}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--right')!

            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 500, clientY: 100 })

            expect(wrapper.style.width).toBe('300px')
        })

        it('should respect maxHeight', () => {
            const { container } = render(
                <Resizable handles={['bottom']} maxHeight={250}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector(
                '.resizable__handle--bottom'
            )!

            fireEvent.pointerDown(handle, { clientX: 100, clientY: 150 })
            fireEvent.pointerMove(document, { clientX: 100, clientY: 500 })

            expect(wrapper.style.height).toBe('250px')
        })

        it('should snap to step increments', () => {
            const { container } = render(
                <Resizable handles={['right']} step={10}>
                    <div>Content</div>
                </Resizable>
            )

            const wrapper = container.querySelector('.resizable') as HTMLElement
            const handle = container.querySelector('.resizable__handle--right')!

            fireEvent.pointerDown(handle, { clientX: 200, clientY: 100 })
            fireEvent.pointerMove(document, { clientX: 215, clientY: 100 })

            // Should snap to nearest 10
            expect(wrapper.style.width).toBe('220px')
        })
    })
})
