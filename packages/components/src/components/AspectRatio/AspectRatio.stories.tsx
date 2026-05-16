import React from 'react'
import AspectRatio from './AspectRatio'

export default {
    title: 'Components/AspectRatio',
    component: AspectRatio,
}

export const Default = () => (
    <div style={{ width: 400 }}>
        <AspectRatio>
            <img
                src="https://picsum.photos/800/450"
                alt="Landscape"
                style={{ objectFit: 'cover' }}
            />
        </AspectRatio>
    </div>
)

export const Square = () => (
    <div style={{ width: 300 }}>
        <AspectRatio ratio={1}>
            <div
                style={{
                    background: 'var(--theme-primary)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                }}
            >
                1:1
            </div>
        </AspectRatio>
    </div>
)

export const FourByThree = () => (
    <div style={{ width: 400 }}>
        <AspectRatio ratio={4 / 3}>
            <img src="https://picsum.photos/800/600" alt="4:3 photo" />
        </AspectRatio>
    </div>
)

export const UltraWide = () => (
    <div style={{ width: 600 }}>
        <AspectRatio ratio={21 / 9}>
            <div
                style={{
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                }}
            >
                21:9 Ultra Wide
            </div>
        </AspectRatio>
    </div>
)
