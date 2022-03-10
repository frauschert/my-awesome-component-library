import React from 'react'

const cursor = {
    both: 'nwse-resize',
    vertical: 'ns-resize',
    horizontal: 'ew-resize',
}

const ResizableComponent = (
    children: React.ReactNode,
    options: { step: number; axis: 'both' | 'horizontal' | 'vertical' }
) => {
    const ref = React.useRef<HTMLDivElement>()
    const { initResize, size, cursor } = useResize(ref, options)

    return (
        <div
            style={{
                backgroundColor: 'pink',
                padding: '20px',
                position: 'relative',
            }}
            ref={() => ref}
        >
            {children}
            <div
                style={{
                    borderBottom: '0 solid transparent',
                    borderRight: '15px solid black',
                    borderTop: '15px solid transparent',
                    bottom: 0,
                    cursor: cursor,
                    display: 'inline-block',
                    height: 0,
                    position: 'absolute',
                    right: 0,
                    width: 0,
                }}
                onMouseDown={initResize}
            />
        </div>
    )
}
export const useResize = (
    ref: React.MutableRefObject<HTMLElement | undefined>,
    options: { step: number; axis: 'both' | 'horizontal' | 'vertical' }
) => {
    ref = ref || {}
    const { step = 1, axis = 'both' } = options || {}
    const [coords, setCoords] = React.useState({ x: Infinity, y: Infinity })
    const [dims, setDims] = React.useState({
        width: Infinity,
        height: Infinity,
    })
    const [size, setSize] = React.useState({
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
            if (axis === 'vertical') ref.current.style.height = width + 'px'
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
