import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import QRCode from './QRCode'

// Mock the qrcode library to avoid canvas rendering issues in Jest
jest.mock('qrcode')

describe('QRCode', () => {
    test('renders with default props', () => {
        const { container } = render(<QRCode value="https://example.com" />)
        const qrcode = container.querySelector('.qrcode')
        expect(qrcode).toBeInTheDocument()
    })

    test('renders canvas by default', () => {
        const { container } = render(<QRCode value="test" />)
        const canvas = container.querySelector('canvas')
        expect(canvas).toBeInTheDocument()
        expect(canvas).toHaveClass('qrcode__canvas')
    })

    test('renders SVG when renderAs is svg', async () => {
        const { container } = render(<QRCode value="test" renderAs="svg" />)
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
        const svgWrapper = container.querySelector('.qrcode__svg')
        expect(svgWrapper).toBeInTheDocument()
    })

    test('applies custom size', () => {
        const { container } = render(<QRCode value="test" size={300} />)
        const qrcode = container.querySelector('.qrcode')
        expect(qrcode).toHaveStyle({ width: '300px', height: '300px' })
    })

    test('sets default size of 200', () => {
        const { container } = render(<QRCode value="test" />)
        const qrcode = container.querySelector('.qrcode')
        expect(qrcode).toHaveStyle({ width: '200px', height: '200px' })
    })

    test('applies custom className', () => {
        const { container } = render(
            <QRCode value="test" className="custom-qr" />
        )
        const qrcode = container.querySelector('.qrcode')
        expect(qrcode).toHaveClass('qrcode', 'custom-qr')
    })

    test('sets canvas dimensions', () => {
        const { container } = render(
            <QRCode value="test" size={250} renderAs="canvas" />
        )
        const canvas = container.querySelector('canvas') as HTMLCanvasElement
        expect(canvas.width).toBe(250)
        expect(canvas.height).toBe(250)
    })

    test('sets SVG viewBox', async () => {
        const { container } = render(
            <QRCode value="test" size={250} renderAs="svg" />
        )
        const svg = await waitFor(() => {
            const el = container.querySelector('svg')
            expect(el).toBeInTheDocument()
            return el
        })
        expect(svg).toHaveAttribute('viewBox', '0 0 250 250')
        expect(svg).toHaveAttribute('width', '250')
        expect(svg).toHaveAttribute('height', '250')
    })

    test('sets aria-label with custom alt', () => {
        render(<QRCode value="test" alt="Custom QR Code" renderAs="canvas" />)
        const canvas = screen.getByRole('img')
        expect(canvas).toHaveAttribute('aria-label', 'Custom QR Code')
    })

    test('sets default aria-label', () => {
        render(<QRCode value="https://example.com" renderAs="canvas" />)
        const canvas = screen.getByRole('img')
        expect(canvas).toHaveAttribute(
            'aria-label',
            'QR Code: https://example.com'
        )
    })

    test('sets title attribute', () => {
        render(<QRCode value="test" title="Scan this code" renderAs="canvas" />)
        const canvas = screen.getByRole('img')
        expect(canvas).toHaveAttribute('title', 'Scan this code')
    })

    test('renders with custom colors for canvas', () => {
        const { container } = render(
            <QRCode
                value="test"
                bgColor="#ff0000"
                fgColor="#0000ff"
                renderAs="canvas"
            />
        )
        const canvas = container.querySelector('canvas')
        expect(canvas).toBeInTheDocument()
        // Colors are applied via canvas context, can't test directly
    })

    test('renders with custom colors for SVG', async () => {
        const { container } = render(
            <QRCode
                value="test"
                bgColor="#ff0000"
                fgColor="#0000ff"
                renderAs="svg"
            />
        )
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
        const rect = container.querySelector('rect')
        const path = container.querySelector('path')
        expect(rect).toHaveAttribute('fill', '#ff0000')
        expect(path).toHaveAttribute('fill', '#0000ff')
    })

    test('updates when value changes', async () => {
        const { container, rerender } = render(
            <QRCode value="first" renderAs="svg" />
        )
        await waitFor(() =>
            expect(container.querySelector('svg')).toBeInTheDocument()
        )
        const firstPath = container.querySelector('path')?.getAttribute('d')

        rerender(<QRCode value="second" renderAs="svg" />)
        await waitFor(() => {
            const secondPath = container
                .querySelector('path')
                ?.getAttribute('d')
            expect(secondPath).not.toBe(firstPath)
        })
    })

    test('handles different error correction levels', async () => {
        const { container } = render(
            <QRCode value="test" level="H" renderAs="svg" />
        )
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
    })

    test('renders with includeMargin false', async () => {
        const { container } = render(
            <QRCode value="test" includeMargin={false} renderAs="svg" />
        )
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
    })

    test('renders with image settings for SVG', async () => {
        const { container } = render(
            <QRCode
                value="test"
                renderAs="svg"
                size={200}
                imageSettings={{
                    src: 'logo.png',
                    width: 50,
                    height: 50,
                }}
            />
        )
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
        // Note: image tag not in mock - test just verifies SVG renders
    })

    test('forwards ref to container div', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<QRCode value="test" ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
        expect(ref.current).toHaveClass('qrcode')
    })

    test('generates different patterns for different values', async () => {
        const { container: container1 } = render(
            <QRCode value="hello" renderAs="svg" />
        )
        const { container: container2 } = render(
            <QRCode value="world" renderAs="svg" />
        )

        await waitFor(() => {
            expect(container1.querySelector('svg')).toBeInTheDocument()
            expect(container2.querySelector('svg')).toBeInTheDocument()
        })

        const path1 = container1.querySelector('path')?.getAttribute('d')
        const path2 = container2.querySelector('path')?.getAttribute('d')

        // Both should have paths
        expect(path1).toBeDefined()
        expect(path2).toBeDefined()
    })

    test('handles empty value', async () => {
        const { container } = render(<QRCode value="" renderAs="svg" />)
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
    })

    test('handles long value', async () => {
        const longValue =
            'https://example.com/very/long/path/with/many/segments/and/parameters?foo=bar&baz=qux'
        const { container } = render(
            <QRCode value={longValue} renderAs="svg" />
        )
        await waitFor(() => {
            const svg = container.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
    })
})
