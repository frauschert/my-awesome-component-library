import React from 'react'
import Carousel from './Carousel'

export default {
    title: 'Components/Carousel',
    component: Carousel,
}

const placeholderSlide = (color: string, label: string) => (
    <div
        style={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color,
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 700,
        }}
    >
        {label}
    </div>
)

export const Default = () => (
    <Carousel>
        {placeholderSlide('#3b82f6', 'Slide 1')}
        {placeholderSlide('#10b981', 'Slide 2')}
        {placeholderSlide('#f59e0b', 'Slide 3')}
    </Carousel>
)

export const AutoPlay = () => (
    <Carousel autoPlay={3000} loop>
        {placeholderSlide('#8b5cf6', 'Slide A')}
        {placeholderSlide('#ef4444', 'Slide B')}
        {placeholderSlide('#06b6d4', 'Slide C')}
    </Carousel>
)

export const NoArrows = () => (
    <Carousel showArrows={false}>
        {placeholderSlide('#3b82f6', 'Slide 1')}
        {placeholderSlide('#10b981', 'Slide 2')}
        {placeholderSlide('#f59e0b', 'Slide 3')}
    </Carousel>
)

export const NoDots = () => (
    <Carousel showDots={false}>
        {placeholderSlide('#3b82f6', 'Slide 1')}
        {placeholderSlide('#10b981', 'Slide 2')}
        {placeholderSlide('#f59e0b', 'Slide 3')}
    </Carousel>
)

export const WithLoop = () => (
    <Carousel loop>
        {placeholderSlide('#3b82f6', 'Slide 1')}
        {placeholderSlide('#10b981', 'Slide 2')}
        {placeholderSlide('#f59e0b', 'Slide 3')}
    </Carousel>
)
