import React, { RefObject, useState } from 'react'

const cursor = {
    both: 'nwse-resize',
    vertical: 'ns-resize',
    horizontal: 'ew-resize',
}

export type ResizeOptions = {
    step: number
    axis: 'both' | 'horizontal' | 'vertical'
}

export const useResize = (
    ref: RefObject<HTMLElement | undefined>,
    options: ResizeOptions
) => {
    ref = ref || {}
    const { step = 1, axis = 'both' } = options || {}
    const [coords, setCoords] = useState({ x: Infinity, y: Infinity })
    const [dims, setDims] = useState({
        width: Infinity,
        height: Infinity,
    })
    const [size, setSize] = useState({
        width: Infinity,
        height: Infinity,
    })

    const initResize = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (!ref.current) return
        setCoords({ x: event.clientX, y: event.clientY })
        const { width, height } = window.getComputedStyle(ref.current)
        setDims({ width: parseInt(width, 10), height: parseInt(height, 10) })
    }

    React.useEffect(() => {
        // Round the size based to `props.step`.
        const getValue = (input: number) => Math.ceil(input / step) * step

        const doDrag = (event: MouseEvent) => {
            if (!ref.current) return

            // Calculate the box size.
            const width = getValue(dims.width + event.clientX - coords.x)
            const height = getValue(dims.height + event.clientY - coords.y)

            // Set the box size.
            if (axis === 'both') {
                ref.current.style.width = width + 'px'
                ref.current.style.height = height + 'px'
            }
            if (axis === 'horizontal') ref.current.style.width = width + 'px'
            if (axis === 'vertical') ref.current.style.height = height + 'px'
            setSize({ width, height })
        }

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag, false)
            document.removeEventListener('mouseup', stopDrag, false)
        }

        document.addEventListener('mousemove', doDrag, false)
        document.addEventListener('mouseup', stopDrag, false)
    }, [dims, coords, step, ref, axis])

    return { initResize, size, cursor: cursor[axis] }
}
