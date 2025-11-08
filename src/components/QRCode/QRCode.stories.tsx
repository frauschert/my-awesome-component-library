import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import QRCode from './QRCode'

const meta: Meta<typeof QRCode> = {
    title: 'Components/QRCode',
    component: QRCode,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'The value to encode in the QR code',
        },
        size: {
            control: { type: 'range', min: 100, max: 500, step: 10 },
            description: 'Size of the QR code in pixels',
        },
        bgColor: {
            control: 'color',
            description: 'Background color',
        },
        fgColor: {
            control: 'color',
            description: 'Foreground color (QR code color)',
        },
        level: {
            control: 'select',
            options: ['L', 'M', 'Q', 'H'],
            description: 'Error correction level',
        },
        includeMargin: {
            control: 'boolean',
            description: 'Include margin/quiet zone',
        },
        renderAs: {
            control: 'radio',
            options: ['canvas', 'svg'],
            description: 'Render as canvas or SVG',
        },
    },
}

export default meta
type Story = StoryObj<typeof QRCode>

export const Default: Story = {
    args: {
        value: 'https://example.com',
        size: 200,
        level: 'M',
    },
}

export const CustomColors: Story = {
    args: {
        value: 'https://example.com',
        size: 200,
        fgColor: '#2563eb',
        bgColor: '#eff6ff',
        level: 'M',
    },
}

export const SVGRendering: Story = {
    args: {
        value: 'https://example.com',
        size: 200,
        renderAs: 'svg',
        level: 'M',
    },
}

export const LargeSize: Story = {
    args: {
        value: 'https://example.com/very/long/url/with/many/segments',
        size: 400,
        level: 'H',
    },
}

export const NoMargin: Story = {
    args: {
        value: 'https://example.com',
        size: 200,
        includeMargin: false,
        level: 'M',
    },
}

export const WithLogo: Story = {
    args: {
        value: 'https://example.com',
        size: 300,
        level: 'H',
        renderAs: 'svg',
        imageSettings: {
            src: 'https://via.placeholder.com/60',
            width: 60,
            height: 60,
            excavate: true,
        },
    },
}

const InteractiveDemo = () => {
    const [value, setValue] = useState('https://example.com')
    const [size, setSize] = useState(250)
    const [fgColor, setFgColor] = useState('#000000')
    const [bgColor, setBgColor] = useState('#ffffff')
    const [renderAs, setRenderAs] = useState<'canvas' | 'svg'>('canvas')

    return (
        <div style={{ padding: '20px' }}>
            <h3>Interactive QR Code Generator</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    marginTop: '20px',
                }}
            >
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            Content
                        </label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter text for QR code"
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            Size: {size}px
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="400"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            marginBottom: '20px',
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Foreground Color
                            </label>
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Background Color
                            </label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            Render As
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                <input
                                    type="radio"
                                    checked={renderAs === 'canvas'}
                                    onChange={() => setRenderAs('canvas')}
                                />
                                Canvas
                            </label>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                <input
                                    type="radio"
                                    checked={renderAs === 'svg'}
                                    onChange={() => setRenderAs('svg')}
                                />
                                SVG
                            </label>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: '15px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    >
                        <strong>Tips:</strong>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            <li>
                                URLs, text, phone numbers, emails work great
                            </li>
                            <li>
                                Higher error correction allows more damage
                                tolerance
                            </li>
                            <li>SVG is scalable without pixelation</li>
                            <li>Canvas is faster for dynamic updates</li>
                        </ul>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            padding: '30px',
                            background: bgColor,
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        <QRCode
                            value={value}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            renderAs={renderAs}
                            level="M"
                        />
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Scan with your phone
                        </div>
                        <div
                            style={{
                                marginTop: '5px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                                maxWidth: size,
                            }}
                        >
                            {value}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Interactive: Story = {
    render: () => <InteractiveDemo />,
}

const UseCasesDemo = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>Common Use Cases</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginTop: '20px',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>Website URL</h4>
                    <QRCode value="https://github.com" size={150} />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Direct visitors to your site
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>WiFi Credentials</h4>
                    <QRCode
                        value="WIFI:T:WPA;S:MyNetwork;P:password123;;"
                        size={150}
                    />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Easy WiFi sharing
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>Email Contact</h4>
                    <QRCode
                        value="mailto:contact@example.com?subject=Hello"
                        size={150}
                    />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Quick email composition
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>Phone Number</h4>
                    <QRCode value="tel:+1234567890" size={150} />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Instant dialing
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>SMS Message</h4>
                    <QRCode value="smsto:+1234567890:Hello there!" size={150} />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Pre-filled text message
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <h4 style={{ marginBottom: '15px' }}>vCard Contact</h4>
                    <QRCode
                        value="BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD"
                        size={150}
                    />
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Save contact info
                    </div>
                </div>
            </div>
        </div>
    )
}

export const UseCases: Story = {
    render: () => <UseCasesDemo />,
}

const BrandedQRDemo = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>Branded QR Codes</h3>
            <p>Custom styling for brand identity</p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '20px',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px',
                            background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            display: 'inline-block',
                        }}
                    >
                        <QRCode
                            value="https://example.com"
                            size={180}
                            fgColor="#ffffff"
                            bgColor="transparent"
                            renderAs="svg"
                        />
                    </div>
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        Purple Gradient
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px',
                            background: '#1a1a1a',
                            borderRadius: '12px',
                            display: 'inline-block',
                        }}
                    >
                        <QRCode
                            value="https://example.com"
                            size={180}
                            fgColor="#10b981"
                            bgColor="#1a1a1a"
                        />
                    </div>
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        Dark Theme
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px',
                            background: '#fef3c7',
                            borderRadius: '12px',
                            display: 'inline-block',
                        }}
                    >
                        <QRCode
                            value="https://example.com"
                            size={180}
                            fgColor="#d97706"
                            bgColor="#fef3c7"
                        />
                    </div>
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        Warm Accent
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px',
                            background:
                                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            borderRadius: '12px',
                            display: 'inline-block',
                        }}
                    >
                        <QRCode
                            value="https://example.com"
                            size={180}
                            fgColor="#ffffff"
                            bgColor="transparent"
                            renderAs="svg"
                        />
                    </div>
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        Pink Gradient
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Branded: Story = {
    render: () => <BrandedQRDemo />,
}
