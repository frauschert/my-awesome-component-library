// Mock for qrcode library in Jest tests
// This allows testing the QRCode component without actual canvas rendering

const QRCodeMock = {
    toCanvas: jest.fn().mockResolvedValue(undefined),
    toString: jest.fn().mockImplementation((text: string, options?: any) => {
        // Generate a minimal SVG for testing
        const size = options?.width || 200
        const bgColor = options?.color?.light || '#ffffff'
        const fgColor = options?.color?.dark || '#000000'

        // Generate a unique path based on input text (simple hash-like approach)
        const hash = text
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const pathData = `M0,0 L${hash % 100},${hash % 100}`

        return Promise.resolve(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
                `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}"/>` +
                `<path d="${pathData}" fill="${fgColor}"/>` +
                `</svg>`
        )
    }),
}

export default QRCodeMock
