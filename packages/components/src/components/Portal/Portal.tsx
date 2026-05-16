import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function createWrapperAndAppendToBody(wrapperId: string) {
    const wrapperElement = document.createElement('div')
    wrapperElement.setAttribute('id', wrapperId)
    document.body.appendChild(wrapperElement)
    return wrapperElement
}

export type PortalProps = {
    children: React.ReactNode
    wrapperId?: string
}

export default function Portal({
    children,
    wrapperId = 'react-portal-wrapper',
}: PortalProps): React.ReactPortal | null {
    const createdRef = useRef(false)
    const [wrapperElement] = useState<HTMLElement>(() => {
        let element = document.getElementById(wrapperId) as HTMLElement | null
        if (!element) {
            createdRef.current = true
            element = createWrapperAndAppendToBody(wrapperId)
        }
        return element
    })

    // Cleanup if we created the element
    useEffect(() => {
        return () => {
            if (createdRef.current && wrapperElement?.parentNode) {
                wrapperElement.parentNode.removeChild(wrapperElement)
            }
        }
    }, [wrapperElement])

    return createPortal(children, wrapperElement)
}
