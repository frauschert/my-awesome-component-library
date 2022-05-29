import React, { RefObject, useCallback, useState } from 'react'

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

    const initResize = (event: React.PointerEvent<HTMLElement>) => {
        if (!ref.current) return
        setCoords({ x: event.clientX, y: event.clientY })
        const { width, height } = window.getComputedStyle(ref.current)
        setDims({ width: parseInt(width, 10), height: parseInt(height, 10) })
    }

    // Round the size based to `props.step`.
    const getValue = useCallback(
        (input: number) => Math.ceil(input / step) * step,
        [step]
    )

    const doDrag = useCallback(
        (event: PointerEvent) => {
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
        },
        [axis, coords.x, coords.y, dims.height, dims.width, getValue, ref]
    )

    React.useEffect(() => {
        const stopDrag = () => {
            document.removeEventListener('pointermove', doDrag, false)
            document.removeEventListener('pointerup', stopDrag, false)
        }

        document.addEventListener('pointermove', doDrag, false)
        document.addEventListener('pointerup', stopDrag, false)
    }, [doDrag])

    return { initResize, size, cursor: cursor[axis] }
}
