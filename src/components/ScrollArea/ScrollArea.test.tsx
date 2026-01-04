import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ScrollArea from './ScrollArea'
import type { ScrollAreaRef } from './ScrollArea'

describe('ScrollArea', () => {
    it('renders children correctly', () => {
        render(
            <ScrollArea height={200}>
                <div data-testid="content">Scroll content</div>
            </ScrollArea>
        )

        expect(screen.getByTestId('content')).toBeInTheDocument()
        expect(screen.getByText('Scroll content')).toBeInTheDocument()
    })

    it('applies height style', () => {
        const { container } = render(
            <ScrollArea height={300}>
                <div>Content</div>
            </ScrollArea>
        )

        const scrollArea = container.querySelector('.scroll-area')
        expect(scrollArea).toHaveStyle({ height: '300px' })
    })

    it('applies height as string', () => {
        const { container } = render(
            <ScrollArea height="50vh">
                <div>Content</div>
            </ScrollArea>
        )

        const scrollArea = container.querySelector('.scroll-area')
        expect(scrollArea).toHaveStyle({ height: '50vh' })
    })

    it('applies maxHeight style', () => {
        const { container } = render(
            <ScrollArea maxHeight={400}>
                <div>Content</div>
            </ScrollArea>
        )

        const scrollArea = container.querySelector('.scroll-area')
        expect(scrollArea).toHaveStyle({ maxHeight: '400px' })
    })

    it('applies width style', () => {
        const { container } = render(
            <ScrollArea width={500}>
                <div>Content</div>
            </ScrollArea>
        )

        const scrollArea = container.querySelector('.scroll-area')
        expect(scrollArea).toHaveStyle({ width: '500px' })
    })

    it('applies size class', () => {
        const { container } = render(
            <ScrollArea size="lg">
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'scroll-area--size-lg'
        )
    })

    it('applies type class', () => {
        const { container } = render(
            <ScrollArea type="always">
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'scroll-area--type-always'
        )
    })

    it('applies horizontal class when horizontal prop is true', () => {
        const { container } = render(
            <ScrollArea horizontal>
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'scroll-area--horizontal'
        )
    })

    it('applies vertical class by default', () => {
        const { container } = render(
            <ScrollArea>
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'scroll-area--vertical'
        )
    })

    it('applies hide-scrollbar class when hideScrollbar is true', () => {
        const { container } = render(
            <ScrollArea hideScrollbar>
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'scroll-area--hide-scrollbar'
        )
    })

    it('applies custom className', () => {
        const { container } = render(
            <ScrollArea className="custom-class">
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveClass(
            'custom-class'
        )
    })

    it('applies custom style', () => {
        const { container } = render(
            <ScrollArea style={{ backgroundColor: 'red' }}>
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area')).toHaveStyle({
            backgroundColor: 'red',
        })
    })

    it('applies contentClassName to viewport', () => {
        const { container } = render(
            <ScrollArea contentClassName="viewport-class">
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area__viewport')).toHaveClass(
            'viewport-class'
        )
    })

    it('calls onScroll when scrolling', () => {
        const onScroll = jest.fn()
        const { container } = render(
            <ScrollArea height={100} onScroll={onScroll}>
                <div style={{ height: '500px' }}>Tall content</div>
            </ScrollArea>
        )

        const viewport = container.querySelector('.scroll-area__viewport')!
        fireEvent.scroll(viewport, { target: { scrollTop: 100 } })

        expect(onScroll).toHaveBeenCalled()
    })

    it('calls onScrollToTop when scrolled to top', () => {
        const onScrollToTop = jest.fn()
        const { container } = render(
            <ScrollArea height={100} onScrollToTop={onScrollToTop}>
                <div style={{ height: '500px' }}>Tall content</div>
            </ScrollArea>
        )

        const viewport = container.querySelector('.scroll-area__viewport')!
        fireEvent.scroll(viewport, { target: { scrollTop: 0 } })

        expect(onScrollToTop).toHaveBeenCalled()
    })

    it('renders shadow elements when shadowOnScroll is true', () => {
        const { container } = render(
            <ScrollArea shadowOnScroll>
                <div>Content</div>
            </ScrollArea>
        )

        expect(
            container.querySelector('.scroll-area__shadow--top')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.scroll-area__shadow--bottom')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.scroll-area__shadow--left')
        ).toBeInTheDocument()
        expect(
            container.querySelector('.scroll-area__shadow--right')
        ).toBeInTheDocument()
    })

    it('does not render shadow elements when shadowOnScroll is false', () => {
        const { container } = render(
            <ScrollArea shadowOnScroll={false}>
                <div>Content</div>
            </ScrollArea>
        )

        expect(
            container.querySelector('.scroll-area__shadow--top')
        ).not.toBeInTheDocument()
    })

    it('applies scrollPadding to viewport', () => {
        const { container } = render(
            <ScrollArea scrollPadding={16}>
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area__viewport')).toHaveStyle({
            padding: '16px',
        })
    })

    it('applies scrollPadding as string', () => {
        const { container } = render(
            <ScrollArea scrollPadding="1rem">
                <div>Content</div>
            </ScrollArea>
        )

        expect(container.querySelector('.scroll-area__viewport')).toHaveStyle({
            padding: '1rem',
        })
    })

    describe('ScrollAreaRef', () => {
        // Mock scrollTo since jsdom doesn't implement it
        beforeEach(() => {
            Element.prototype.scrollTo = jest.fn(function (
                this: Element,
                optionsOrX?:
                    | number
                    | {
                          top?: number
                          left?: number
                          behavior?: 'auto' | 'smooth' | 'instant'
                      },
                y?: number
            ) {
                if (typeof optionsOrX === 'number') {
                    ;(this as HTMLElement).scrollLeft = optionsOrX
                    if (y !== undefined) {
                        ;(this as HTMLElement).scrollTop = y
                    }
                } else if (optionsOrX) {
                    if (optionsOrX.top !== undefined) {
                        ;(this as HTMLElement).scrollTop = optionsOrX.top
                    }
                    if (optionsOrX.left !== undefined) {
                        ;(this as HTMLElement).scrollLeft = optionsOrX.left
                    }
                }
            }) as any
            Element.prototype.scrollBy = jest.fn(function (
                this: Element,
                optionsOrX?:
                    | number
                    | {
                          top?: number
                          left?: number
                          behavior?: 'auto' | 'smooth' | 'instant'
                      },
                y?: number
            ) {
                if (typeof optionsOrX === 'number') {
                    ;(this as HTMLElement).scrollLeft += optionsOrX
                    if (y !== undefined) {
                        ;(this as HTMLElement).scrollTop += y
                    }
                } else if (optionsOrX) {
                    if (optionsOrX.top !== undefined) {
                        ;(this as HTMLElement).scrollTop += optionsOrX.top
                    }
                    if (optionsOrX.left !== undefined) {
                        ;(this as HTMLElement).scrollLeft += optionsOrX.left
                    }
                }
            }) as any
        })

        it('exposes scrollToTop method', () => {
            const ref = React.createRef<ScrollAreaRef>()
            const { container } = render(
                <ScrollArea ref={ref} height={100}>
                    <div style={{ height: '500px' }}>Tall content</div>
                </ScrollArea>
            )

            const viewport = container.querySelector(
                '.scroll-area__viewport'
            ) as HTMLDivElement
            viewport.scrollTop = 200

            act(() => {
                ref.current?.scrollToTop()
            })

            expect(viewport.scrollTop).toBe(0)
        })

        it('exposes scrollTo method', () => {
            const ref = React.createRef<ScrollAreaRef>()
            const { container } = render(
                <ScrollArea ref={ref} height={100}>
                    <div style={{ height: '500px' }}>Tall content</div>
                </ScrollArea>
            )

            act(() => {
                ref.current?.scrollTo({ top: 150 })
            })

            const viewport = container.querySelector(
                '.scroll-area__viewport'
            ) as HTMLDivElement
            expect(viewport.scrollTop).toBe(150)
        })

        it('exposes getViewport method', () => {
            const ref = React.createRef<ScrollAreaRef>()
            const { container } = render(
                <ScrollArea ref={ref}>
                    <div>Content</div>
                </ScrollArea>
            )

            const viewport = ref.current?.getViewport()
            expect(viewport).toBe(
                container.querySelector('.scroll-area__viewport')
            )
        })

        it('exposes getScrollPosition method', () => {
            const ref = React.createRef<ScrollAreaRef>()
            const { container } = render(
                <ScrollArea ref={ref} height={100}>
                    <div style={{ height: '500px' }}>Tall content</div>
                </ScrollArea>
            )

            const viewport = container.querySelector(
                '.scroll-area__viewport'
            ) as HTMLDivElement
            viewport.scrollTop = 100
            viewport.scrollLeft = 50

            const position = ref.current?.getScrollPosition()
            expect(position).toEqual({ top: 100, left: 50 })
        })
    })

    describe('size variants', () => {
        it.each(['sm', 'md', 'lg'] as const)(
            'applies %s size class',
            (size) => {
                const { container } = render(
                    <ScrollArea size={size}>
                        <div>Content</div>
                    </ScrollArea>
                )

                expect(container.querySelector('.scroll-area')).toHaveClass(
                    `scroll-area--size-${size}`
                )
            }
        )
    })

    describe('type variants', () => {
        it.each(['auto', 'always', 'hover', 'scroll'] as const)(
            'applies %s type class',
            (type) => {
                const { container } = render(
                    <ScrollArea type={type}>
                        <div>Content</div>
                    </ScrollArea>
                )

                expect(container.querySelector('.scroll-area')).toHaveClass(
                    `scroll-area--type-${type}`
                )
            }
        )
    })
})
